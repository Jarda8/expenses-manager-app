/* @flow */
import type { Account } from '../DataSources/AccountsDS';
import type { updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { csApiKey, csClientId, csClientSecret, csProfileURI, csAccountsURI, csTokenURI, redirectURI } from '../Shared/Constants';

export default class CSAPIClient {

  static async fetchProfileInfo(accessToken: string) {
    try {
      let response = await fetch(csProfileURI, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Accept-Encoding': 'gzip',
          // 'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',// demo údaj
          // 'Authorization': 'Bearer demo_001'// demo údaj
          'WEB-API-key': csApiKey,
          'Authorization': accessToken
        }
      });
      let responseJson = await response.json();
      // Check for access token validity error. If there is one, refresh token.
      // Do something with the profile info data.
    } catch(error) {
      console.log('fetchProfileInfo error:');
      console.log(error);
    }
  }

  static async fetchAccount(name: string, number: string, accessToken: string, refreshToken: string) {
    let accounts = await this.fetchAccounts(accessToken, refreshToken);
    console.log('accounts: ' + accounts);
    let account = accounts.find(acc => acc.accountno.number === number);
    if (account === undefined) {
      return null;
    }
    return {name: name, number: number, iban: account.accountno['cz-iban'], bankName: 'Česká spořitelna', type: 'Bank account', balance: account.balance.value, currency: account.balance.currency, accessToken: accessToken, refreshToken: refreshToken, lastTransactionsDownload: null};
  }

  static async fetchAccounts(accessToken: string, refreshToken: string) {
    try {
      let response;
      while (true) {
        response = await fetch(csAccountsURI, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Accept-Encoding': 'gzip',
            // 'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',
            // 'Authorization': 'Bearer demo_001'
            'WEB-API-key': csApiKey,
            'Authorization': accessToken
          }
        });
        let status = this.resolveErrors(response);
        if (status.status === 'OK') {
          break;
        } else {
          throw 'Unhandled error: ' + status.status;
        }
      }
      let responseJson = await response.json();
      return responseJson.accounts;
    } catch(error) {
      console.log('fetchAccounts error:');
      console.log(error);
    }
  }

  static async refreshAccessToken(refreshToken: string, accountId: number) {
    let requestBody = {
      'client_id': csClientId,
      'cleint_secret': csClientSecret,
      'redirect_uri': redirectURI,
      'refresh_token': refreshToken,
      'grant_type': 'refresh_token'
    };
    try {
      let response;
      while (true) {
        response = await fetch(csTokenURI, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body:
          Object.keys(requestBody).map(key =>
            encodeURIComponent(key) + '=' + encodeURIComponent(requestBody[key])
          ).join('&')
        });
        let status = this.resolveErrors(response);
        if (status.status === 'OK') {
          break;
        } else {
          throw 'Unhandled error: ' + status.status;
        }
      }
      let responseJson = await response.json();
      let newAccessToken = responseJson.token_type + ' ' + responseJson.access_token;
      updateAccountByIdAsync(accountId, {accessToken: newAccessToken});
      return newAccessToken;
    } catch(error) {
      console.log('refreshAccessToken error:');
      console.log(error);
    }
  }

  static async requestFetchTransactions(fromDate: Date, toDate: Date, iban: string, accessToken: string) {
    return fetch(csAccountsURI + '/' + iban + '/transactions?dateStart=' + encodeURIComponent(fromDate.toISOString()) + '&dateEnd=' + encodeURIComponent(toDate.toISOString()), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 'Accept-Encoding': 'gzip',
        // 'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',
        // 'Authorization': 'Bearer demo_001'
        'WEB-API-key': csApiKey,
        'Authorization': accessToken
      }
    });
  }

  static async fetchTransactions(fromDate: Date, toDate: Date, account: Account) {
    try {
      // let response = await fetch('https://api.csas.cz/sandbox/webapi/api/v1/netbanking/my/accounts/' +
      let response;
      while (true) {
        response = await this.requestFetchTransactions(fromDate, toDate, account.iban, account.accessToken);
        let status = this.resolveErrors(response, account);
        if (status.status === 'OK') {
          break;
        } else if (status.status === 'TOKEN_EXPIRED'){
          account.accessToken = status.data;
        } else {
          throw 'Unhandled error: ' + status.status;
        }
        // if (response.status == 403) {
        //   let errors = await response.json();
        //   for (error of errors) {
        //     if (error.error === 'TOKEN_EXPIRED') {
        //       let newAccessToken = await this.refreshAccessToken(account.refreshToken, account._id);
        //       response = await this.requestFetchTransactions(fromDate, toDate, account.iban, newAccessToken);
        //     }
        //     break;
        //   }
        // }
      }
      let responseJson = await response.json();
      // console.log(responseJson.transactions);
      return this.parseTransactions(responseJson.transactions, account._id);
    } catch(error) {
      console.log('fetchTransactions error:');
      console.log(error);
    }
  }

  static parseTransactions(transactions: Array<Object>, accountId: number): Array<Transaction> {
    let parsedTransactions = transactions.map(t => {
      let defaultCategory = 'OTHERS_EXPENSE';
      if (t.amount.value > 0) {
        defaultCategory = 'OTHERS_INCOME';
      }

      return (
      {
        accountId: accountId,
        category: defaultCategory,
        amount: t.amount.value,
        currency: t.amount.currency,
        date: new Date(t.bookingDate),
        note: t.payerNote,
        accountParty: {
          info: t.accountParty.partyInfo,
          description: t.accountParty.partyDescription,
          iban: t.accountParty.iban,
          bic: t.accountParty.bic,
          accountNumber: t.accountParty.accountNumber,
          prefix: t.accountParty.accountPrefix,
          bankCode: t.accountParty.bankCode
        },
        constantSymbol: t.constantSymbol,
        variableSymbol: t.variableSymbol,
        specificSymbol: t.specificSymbol,
        description: t.description,
        payeeNote: t.payeeNote
      })
    });
    console.log('end parseTransactions');
    return parsedTransactions;
  }

  async resolveErrors(response: Object, account: Object): {status: string, data: string} {
    let status;
    if (response.status === 200 || response.status === 204) {
      status = {status: 'OK'};
    } else if (response.status === 403) {
      let errors = await response.json();
      for (error of errors) {
        if (error.error === 'TOKEN_EXPIRED') {
          let newAccessToken = await this.refreshAccessToken(account.refreshToken, account._id);
          status = {status: 'TOKEN_EXPIRED', data: newAccessToken};
        } else {
          console.log('resolveErrors unknown error: status:' + response.status + ', error: ' + error.error);
          status = {status: 'UNKNOWN_ERROR'};
          break;
        }
      }
    } else {
      console.log('resolveErrors unknown response status: ' + response.status);
      status = {status: 'UNKNOWN_ERROR'};
    }
    return status;
  }
}
