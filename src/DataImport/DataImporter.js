/* @flow */
import { Alert } from 'react-native';

import CSAPIClient from './CSAPIClient';
import { accountTypes, getAccountsAsync, updateAccountByIdAsync } from '../DataSources/AccountsDS';
import type { Account } from '../DataSources/AccountsDS';
import { saveTransactionAsync } from '../DataSources/TransactionsDS';
import type { Transaction } from '../DataSources/TransactionsDS';
import { getPendingTransfersAsync, saveTransferAsync, updateTransferAsync } from '../DataSources/TransfersDS';
import Categorization from './Categorization';
import BudgetChecker from '../Shared/BudgetChecker'

export default class DataImporter {

  static async fetchTransactions(callback: () => void) {
    getAccountsAsync(async accounts => {
      let toDate = new Date();
      let fromDate;
      let connectedAccounts = accounts.filter(acc => acc.connected);
      for (account of connectedAccounts) {
        fromDate = account.lastTransactionsDownload;
        if (fromDate === null) {
          fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1, 0, 0, 0, 0);
        }
        if (fromDate.getFullYear() === toDate.getFullYear()
        && fromDate.getMonth() === toDate.getMonth()
        && fromDate.getDate() === toDate.getDate()) {
          // do nothing
        } else {
          switch (account.bankName) {
            case 'Česká spořitelna':
            try {
              let transactions = await CSAPIClient.fetchTransactions(fromDate, toDate, account);
              await this.processTransactions(transactions, account._id, toDate, accounts);
            } catch (e) {
              Alert.alert('Vyskytla se neznámá chyba. Opakujte prosím později.');
            }
              break;
          }
        }
      }
      if (callback) {
        callback();
      }

    });
  }

  static async processTransactions(transactions: Array<Transaction>, accountId: number, date: Date, accounts: Array<Account>) {
    if (transactions.length === 0) {
      return;
    }
    let nonTransferTransactions = await this.processTransfers(transactions, accounts);
    if (nonTransferTransactions.length > 0) {
      let categories = await Categorization.categorizeTransactions(nonTransferTransactions);
      for (var i = 0; i < nonTransferTransactions.length; i++) {
        nonTransferTransactions[i].category = categories[i];
      }
      for (transaction of nonTransferTransactions) {
        await saveTransactionAsync(transaction);
      }
      let alertText = await BudgetChecker.checkBudgetsAfterTransactions(nonTransferTransactions);
      if (alertText) {
        Alert.alert(alertText.title, alertText.body);
      }
    }
    await updateAccountByIdAsync(accountId, {lastTransactionsDownload: date});
  }

  static async processTransfers(transactions: Array<Transaction>, accounts: Array<Account>) {
    let transfers = transactions.filter((transaction) => {
      for (account of accounts) {
        if (account.number === transaction.accountParty.accountNumber) {
          return true;
        }
      }
      return false;
    });
    let otherTransactions = transactions.filter(transaction => transfers.indexOf(transaction) < 0 );
    for (transfer of transfers) {
      let transferAccount = accounts.find(account => account._id === transfer.accountId);
      let transferAccountParty = accounts.find(account => account.number === transfer.accountParty.accountNumber);
      await this.processTransfer(transfer, transferAccount, transferAccountParty, otherTransactions);
    }
    return otherTransactions;
  }

  static async processTransfer(transaction: Transaction, account: Account, accountParty: Account, nonTransferTransactions: Array<Transaction>) {
    let pendingTransfers = await getPendingTransfersAsync();
    let pendingTransfer = pendingTransfers.find((transfer) => {
      if (transaction.amount > 0) {
        return (transfer.toAccountId === account._id
        && transfer.fromAccountId === accountParty._id)
      } else {
        return (transfer.fromAccountId === account._id
        && transfer.toAccountId === accountParty._id);
      }
    });
    let fromAccount;
    let toAccount;
    let fromAmount;
    let toAmount;
    if (transaction.amount > 0) {
      fromAccount = accountParty;
      toAccount = account;
      fromAmount = 0;
      if (!accountParty.connected) {
        fromAmount = transaction.amount;
      }
      toAmount = transaction.amount;
    } else {
      fromAccount = account;
      toAccount = accountParty;
      fromAmount = -transaction.amount;
      toAmount = 0;
      if (!accountParty.connected) {
        toAmount = -transaction.amount;
      }
    }
    if (pendingTransfer) {
      if (pendingTransfer.fromAmount === 0) {
        await updateTransferAsync(pendingTransfer, {fromAmount: fromAmount, state: 'finished', note: transaction.note});
      } else {
        await updateTransferAsync(pendingTransfer, {toAmount: toAmount, state: 'finished'});
      }
    } else {
      if (accountParty.connected) {
        await saveTransferAsync(
          {
            fromAccountId: fromAccount._id,
            toAccountId: toAccount._id,
            fromAmount: fromAmount,
            toAmount: toAmount,
            date: new Date(transaction.date),
            note: transaction.note,
            state: 'pending',
            fromCurrency: fromAccount.currency,
            toCurrency: toAccount.currency
          }
        );
      } else {
        if (fromAccount.currency === toAccount.currency) {
          await saveTransferAsync(
            {
              fromAccountId: fromAccount._id,
              toAccountId: toAccount._id,
              fromAmount: fromAmount,
              toAmount: toAmount,
              date: new Date(t.bookingDate),
              note: transaction.note,
              state: "finished",
              fromCurrency: fromAccount.currency,
              toCurrency: toAccount.currency
            }
          );
        } else {
          nonTransferTransactions.push(transaction);
        }
      }
    }
  }
}
