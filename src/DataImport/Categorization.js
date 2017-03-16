/* @flow */
import type { Transaction } from '../DataSources/TransactionsDS';
import { categorizeURI, addCategorizationURI } from '../Shared/Constants'

export default class Categorization {

  static async categorizeTransactionsTest() {
    console.log('categorizeTransactionsTest');
    try {
      let response = await fetch(categorizeURI, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          [
            {
              accountId: 1,
              category: 'OTHERS_EXPENSE',
              amount: -500,
              currency: 'CZK',
              date: new Date(),
              note: 'poznámka pro mě',
              accountParty: {
                info: 'Petr Malý',
                description: '2812275553/0800',
                iban: 'CZ2208000011850554023124',
                bic: 'GIBACZPX',
                accountNumber: '2812275553',
                prefix: null,
                bankCode: '0800'
              },
              constantSymbol: null,
              variableSymbol: '86689',
              specificSymbol: null,
              description: 'domácí platba',
              payeeNote: 'rezervace, Petr Malý'
            },
            {
              accountId: 1,
              category: 'OTHERS_EXPENSE',
              amount: -200,
              currency: 'CZK',
              date: new Date(),
              note: 'jiná poznámka pro mě',
              accountParty: {
                info: 'Jindra Bílí',
                description: '2812278523/0710',
                iban: 'CZ2208000011850554023124',
                bic: 'GIBACDIK',
                accountNumber: '2812278523',
                prefix: null,
                bankCode: '0710'
              },
              constantSymbol: null,
              variableSymbol: null,
              specificSymbol: null,
              description: 'bla bla',
              payeeNote: 'platba za něco'
            }
          ]
        )
      });
      let responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.log('categorizeTransactions error:');
      console.log(error);
    }
  }

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
