/* @flow */
import type { Transaction } from '../DataSources/TransactionsDS';
import { categorizeURI, addCategorizationURI } from '../Shared/Constants'

export default class Categorization {

  static async categorizeTransactions(transactions: Array<Transaction>) {
    try {
      let response = await fetch(categorizeURI, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactions)
      });
      console.log(response);
      let responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.log('categorizeTransactions error:');
      console.log(error);
    }
  }

  static addNewCategorization(categorizedTransaction) {
    try {
      fetch(addCategorizationURI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categorizedTransaction)
      });
    } catch(error) {
      console.log('addNewCategorization error:');
      console.log(error);
    }
  }
}
