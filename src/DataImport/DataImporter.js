/* @flow */
import CSAPIClient from './CSAPIClient';
import { accountTypes, getAccountsAsync } from '../DataSources/AccountsDS';
import { saveTransactionAsync } from '../DataSources/TransactionsDS';
import type { Transaction } from '../DataSources/TransactionsDS';

export default class DataImporter {

  static async fetchTransactions() {
    getAccountsAsync(accounts => {
      let toDate = new Date();
      let fromDate = new Date(toDate);
      fromDate.setHours(fromDate.getHours() - 12);
      let connectedAccounts = accounts.filter(acc => acc.connected);
      for (account of connectedAccounts) {

        switch (account.bankName) {
          case 'Česká spořitelna':
          CSAPIClient.fetchTransactions(fromDate, toDate, account).then(transactions => {
            if (transactions.length === 0) {
              return;
            }
            console.log('before categorizeTransactions');
            this.categorizeTransactions(transactions).then(categorizedTransactions => {
              console.log('categorizedTransactions: ');
              console.log(categorizedTransactions);
            // for (transaction of transactions) {
            //   saveTransactionAsync(transaction);
            // }
            })
          });
            break;
        }

      }
    });
  }

  static async categorizeTransactions(transactions: Array<Transaction>) {
    try {
      let response = await fetch('http://10.0.3.2:8081/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({"baf": "lek"})
        body: JSON.stringify(transactions)
      });
      let responseJson = await response.json();
      // console.log(JSON.stringify({"baf": "lek"}));
      // console.log(responseJson.hello);
      return responseJson;
    } catch(error) {
      console.log('categorizeTransactions error:');
      console.log(error);
    }
  }
}
