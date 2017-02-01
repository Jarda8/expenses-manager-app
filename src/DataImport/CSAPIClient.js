/* @flow */
import type { Account } from '../DataSources/AccountsDS'

export default class CSAPIClient {

  static async fetchProfileInfo() {
    try {
      let response = await fetch('https://api.csas.cz/sandbox/webapi/api/v3/netbanking/my/profile', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Accept-Encoding': 'gzip',
          'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',// demo údaj
          'Authorization': 'Bearer demo_001'// demo údaj
        }
      });
      let responseJson = await response.json();
    } catch(error) {
      console.log('fetchProfileInfo error:');
      console.log(error);
    }
  }

  static async fetchAccount(name: string, accountNumber: string) {
    let accounts = await this.fetchAccounts();
    let account = accounts.find(acc => acc.accountno.number === accountNumber);
    if (account === undefined) {
      return null;
    }
    return {name: name, number: accountNumber, iban: account.accountno['cz-iban'], bankName: 'Česká spořitelna', type: 'Bank account', balance: account.balance.value, currency: account.balance.currency};
  }

  static async fetchAccounts() {
    try {
      let response = await fetch('https://api.csas.cz/sandbox/webapi/api/v3/netbanking/my/accounts', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Accept-Encoding': 'gzip',
          'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',
          'Authorization': 'Bearer demo_001'
        }
      });
      let responseJson = await response.json();
      return responseJson.accounts;
    } catch(error) {
      console.log('fetchAccounts error:');
      console.log(error);
    }
  }

  static async fetchTransactions(fromDate: Date, toDate: Date, iban: string) {
    try {
      let response = await fetch('https://api.csas.cz/sandbox/webapi/api/v1/netbanking/my/accounts/' + iban + '/transactions?dateStart=' + fromDate.toISOString() + '&dateEnd=' + toDate.toISOString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Accept-Encoding': 'gzip',
          'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',
          'Authorization': 'Bearer demo_001'
        }
      });
      let responseJson = await response.json();
      console.log(responseJson.transactions);
      return responseJson.transactions;
    } catch(error) {
      console.log('fetchTransactions error:');
      console.log(error);
    }
  }
}
