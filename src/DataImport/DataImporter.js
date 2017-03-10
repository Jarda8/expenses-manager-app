/* @flow */
import { Alert } from 'react-native';

import CSAPIClient from './CSAPIClient';
import { accountTypes, getAccountsAsync, updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { saveTransactionAsync } from '../DataSources/TransactionsDS';
import type { Transaction } from '../DataSources/TransactionsDS';
import Categorization from './Categorization';

export default class DataImporter {

  static async fetchTransactions() {
    getAccountsAsync(accounts => {
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
          Alert.alert('Transakce lze stahovat pouze jednou za den.');
        } else {
          switch (account.bankName) {
            case 'Česká spořitelna':
            CSAPIClient.fetchTransactions(fromDate, toDate, account).then((transactions) => {
              this.processTransactions(transactions, account._id, toDate);
            });
              break;
          }
        }
      }
    });
  }

  static async processTransactions(transactions: Array<Transaction>, accountId: number, date: Date) {
    console.log(transactions);
    if (transactions.length === 0) {
      return;
    }
    Categorization.categorizeTransactions(transactions).then(async (categories) => {
      console.log('categorizedTransactions: ');
      console.log(categories);
      for (var i = 0; i < transactions.length; i++) {
        transactions[i].category = categories[i];
      }
      for (transaction of transactions) {
        await saveTransactionAsync(transaction);
      }
      updateAccountByIdAsync(accountId, {lastTransactionsDownload: date});
    });
  }
}
