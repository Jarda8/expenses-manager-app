/* @flow */
import type { Account } from '../DataSources/AccountsDS';
import { updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { csApiKey, csClientId, csClientSecret, csProfileURI, csAccountsURI, csTokenURI, redirectURI, csTransactionsURI } from '../Shared/Constants';

export default class CSAPIClient {

  static async fetchAccount(name: string, number: string, accessToken: string, refreshToken: string) {
    let accounts = await this.fetchAccounts(accessToken, refreshToken);
    let account = accounts.find(acc => {
      return acc.accountno.number === number;
    });
    if (account === undefined) {
      return null;
    }
    return {name: name, number: number, accountId: account.id, iban: account.accountno['cz-iban'], bankName: 'Česká spořitelna', type: 'Bank account', balance: account.balance.value, currency: account.balance.currency, accessToken: accessToken, refreshToken: refreshToken, lastTransactionsDownload: null};
  }

  static async fetchAccounts(accessToken: string, refreshToken: string) {
    try {
      let response;
      while (true) {
        response = await fetch(csAccountsURI, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'WEB-API-key': csApiKey,
            'Authorization': accessToken
          }
        });
        let status = await this.resolveErrors(response, null);
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
      throw error;
    }
  }

  static async refreshAccessToken(refreshToken: string, accountId: number) {
    let requestBody = {
      'client_id': csClientId,
      'client_secret': csClientSecret,
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
        let status = await this.resolveErrors(response);
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

  static formatDate(date: Date): string {
    let dateString = date.toISOString();
    let [dateWithoutMilis, ] = dateString.split('.');
    let result = dateWithoutMilis + 'Z';
    return result;
  }

  static async requestFetchTransactions(fromDate: Date, toDate: Date, iban: string, accessToken: string) {
    let formattedFromDate = this.formatDate(fromDate);
    let formattedToDate = this.formatDate(toDate);
    try {
      let response = await fetch(csTransactionsURI + '/' + iban + '/transactions?dateStart=' + encodeURIComponent(formattedFromDate) + '&dateEnd=' + encodeURIComponent(formattedToDate), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'WEB-API-key': csApiKey,
          'Authorization': accessToken
          // 'WEB-API-key': '35bd5a35-5909-460e-b3c2-20073d9c4c2e',
          // 'Authorization': 'Bearer demo_001'
        }
      });
      return response;
    } catch (error) {
      console.log('requestFetchTransactions error:');
      console.log(error);
      throw error;
    }
  }

  static async fetchTransactions(fromDate: Date, toDate: Date, account: Account) {
    try {
      let response;
      while (true) {
        response = await this.requestFetchTransactions(fromDate, toDate, account.iban, account.accessToken);
        let status = await this.resolveErrors(response, account);
        if (status.status === 'OK') {
          break;
        } else if (status.status === 'TOKEN_EXPIRED'){
          account.accessToken = status.data;
          if (account.accessToken === undefined) {
            throw 'access token error';
          }
        } else {
          throw 'Unhandled error: ' + status.status;
        }
      }
      let responseJson = await response.json();
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
    return parsedTransactions;
  }

  static async resolveErrors(response: Object, account: Object): {status: string, data: string} {
    let status;
    if (response.status === 200 || response.status === 204) {
      status = {status: 'OK'};
    } else if (response.status === 403) {
      let responseJson = await response.json();
      let errors = responseJson.errors;
      for (error of errors) {
        if ((error.error === 'TOKEN_EXPIRED' || error.error.includes('invalid_token')) && account !== undefined) {
          let newAccessToken = await this.refreshAccessToken(account.refreshToken, account._id);
          status = {status: 'TOKEN_EXPIRED', data: newAccessToken};
        } else {
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
