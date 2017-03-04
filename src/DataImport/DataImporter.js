/* @flow */
import CSAPIClient from './CSAPIClient';
import { accountTypes, getAccountsAsync } from '../DataSources/AccountsDS';
import { saveTransactionAsync } from '../DataSources/TransactionsDS';
import type { Transaction } from '../DataSources/TransactionsDS';
import Categorization from './Categorization';

export default class DataImporter {

  static async fetchTransactions() {
    Categorization.categorizeTransactionsTest();
    // getAccountsAsync(accounts => {
    //   let toDate = new Date();
    //   let fromDate;
    //   let connectedAccounts = accounts.filter(acc => acc.connected);
    //   for (account of connectedAccounts) {
    //     fromDate = account.lastTransactionsDownload;
    //     if (fromDate === null) {
    //       fromDate = new Date(toDate.getFullYear, toDate.getMonth, 1, 0, 0, 0, 0);
    //     }
    //     switch (account.bankName) {
    //       case 'Česká spořitelna':
    //       CSAPIClient.fetchTransactions(fromDate, toDate, account).then(transactions => {
    //         if (transactions.length === 0) {
    //           return;
    //         }
    //         console.log('before categorizeTransactions');
    //         Categorization.categorizeTransactions(transactions).then(categorizedTransactions => {
    //           console.log('categorizedTransactions: ');
    //           console.log(categorizedTransactions);
    //         // for (transaction of transactions) {
    //         //   saveTransactionAsync(transaction);
    //         // }
    //         })
    //       });
    //         break;
    //     }
    //
    //   }
    // });
  }
}
