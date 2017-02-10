/* @flow */
import type { Account } from '../DataSources/AccountsDS';
import type { updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { apiKey, clientId, clientSecret, profileURI, accountsURI, tokenURI } from '../Shared/Constants';

export default class CSAPIClient {

  static async fetchProfileInfo(accessToken: string) {
    try {
      let response = await fetch(profileURI, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Accept-Encoding': 'gzip',
          // 'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',// demo údaj
          // 'Authorization': 'Bearer demo_001'// demo údaj
          'WEB-API-key': apiKey,
          'Authorization': accessToken
        }
      });
      let responseJson = await response.json();
    } catch(error) {
      console.log('fetchProfileInfo error:');
      console.log(error);
    }
  }

  static async fetchAccount(name: string, number: string, accessToken: string, refreshToken: string) {
    let accounts = await this.fetchAccounts(accessToken);
    let account = accounts.find(acc => acc.accountno.number === number);
    if (account === undefined) {
      return null;
    }
    return {name: name, number: number, iban: account.accountno['cz-iban'], bankName: 'Česká spořitelna', type: 'Bank account', balance: account.balance.value, currency: account.balance.currency, accessToken: accessToken, refreshToken: refreshToken};
  }

  static async fetchAccounts(accessToken: string) {
    try {
      let response = await fetch(accountsURI, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Accept-Encoding': 'gzip',
          // 'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',
          // 'Authorization': 'Bearer demo_001'
          'WEB-API-key': apiKey,
          'Authorization': accessToken
        }
      });
      let responseJson = await response.json();
      return responseJson.accounts;
    } catch(error) {
      console.log('fetchAccounts error:');
      console.log(error);
    }
  }

  static async refreshAccessToken(refreshToken: string, accountId: number) {
    let requestBody = {
      'client_id': clientId,
      'cleint_secret': clientSecret,
      'redirect_uri': 'http://dummy.cz',
      'refresh_token': refreshToken,
      'grant_type': 'refresh_token'
    };
    try {
        let response = await fetch(tokenURI, {
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
      if (false) {
        // TODO: Pokud bude neplatný refresh token, musí se uživatel znovu přihlásit
        // tady vrátim něco, abych navigoval na přihlašovací obrazvoku nebo přímo odnaviguju
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
    return fetch(accountsURI + iban + '/transactions?dateStart=' + encodeURIComponent(fromDate.toISOString()) + '&dateEnd=' + encodeURIComponent(toDate.toISOString()), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 'Accept-Encoding': 'gzip',
        // 'WEB-API-key': 'dec841d5-0e40-4a40-94ec-42de1b4f9631',
        // 'Authorization': 'Bearer demo_001'
        'WEB-API-key': apiKey,
        'Authorization': accessToken
      }
    });
  }

  static async fetchTransactions(fromDate: Date, toDate: Date, account: Account) {
    try {
      // let response = await fetch('https://api.csas.cz/sandbox/webapi/api/v1/netbanking/my/accounts/' +
      let response = await this.requestFetchTransactions(fromDate, toDate, account.iban, account.accessToken);
      if (response.status == 403) {
        let errors = await response.json();
        for (error of errors) {
          if (error.error === 'TOKEN_EXPIRED') {
            let newAccessToken = await this.refreshAccessToken(account.refreshToken, account._id);
            response = await this.requestFetchTransactions(fromDate, toDate, account.iban, newAccessToken);
          }
          break;
        }
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
        date: new Date(t.valuationDate),
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
}
