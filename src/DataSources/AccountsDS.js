/* @flow */
import EventEmitter from 'EventEmitter';
import CurrencyConverter from '../CurrencyConverter';

import { DB } from './DB';
import { deleteTransactionsByAccountIdAsync } from './TransactionsDS';

const ACCOUNTS_DS_EVENT_EMITTER = new EventEmitter();

export type Account = {
  _id: number,
  accountId: string,
  name: string,
  number: string,
  iban: string,
  bankName: string,
  type: string,
  balance: number,
  currency: string,
  connected: boolean,
  accessToken: string,
  refreshToken: string,
  lastTransactionsDownload: Date
}

var accountTypes = new Map();
accountTypes.set('Bank account', 'Bankovní účet');
accountTypes.set('Cash', 'Hotovost');

function getAccountsAsync(callback: (result: Array<Account>) => void) {
  DB.accounts.get_all(result => {
    let resultArray: Array<Account> = [];
    Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
    for (account of resultArray) {
      if (account.lastTransactionsDownload) {
        account.lastTransactionsDownload = new Date(account.lastTransactionsDownload);
      }
    }
    callback(resultArray);
  });
}

function getAccountAsync(id: number, callback: (result: Account) => void) {
  DB.accounts.get_id(id, result => {
    callback(result[0]);
  });
}

function saveAccountAsync(account: Account) {
  DB.accounts.add(account, result => ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged', {}));
}

function updateAccountAsync(oldAccount: Account, newAccount: Account, callback: any) {
  DB.accounts.update(oldAccount, newAccount, result => {
    ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged', {});
    if (callback) {
      callback(result);
    }
  });
}

function updateAccountByIdAsync(id: number, newData: Object, callback: any) {
  DB.accounts.update_id(id, newData, result => {
    ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged', {});
    if (callback) {
      callback(result);
    }
  });
}

function deleteAccountAsync(account: Account) {
  DB.accounts.remove_id(account._id, result => {
    ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged', {});
    deleteTransactionsByAccountIdAsync(account._id);
  });
}

function getTotalBalanceAsync(callback: (result: number) => void) {
  getAccountsAsync((accounts) => {
    convertToCrowns(accounts).then((convertedAccounts) => {
      let totalBalance = convertedAccounts.reduce((x, y) => {return {balance: x.balance + y.balance}}, {balance: 0}).balance;
      callback(totalBalance);
    })
  });
}

async function convertToCrowns(accounts: Array<Account>): Array<Account> {
  let accountsWithCovertedCurrecy = [];
  for (account of accounts) {
    account.balance = await CurrencyConverter.convertCurrency(account.currency, account.balance);
    accountsWithCovertedCurrecy.push(account);
  }
  return accountsWithCovertedCurrecy;
}

export { ACCOUNTS_DS_EVENT_EMITTER, accountTypes, getAccountAsync, getAccountsAsync, saveAccountAsync, updateAccountAsync, updateAccountByIdAsync, deleteAccountAsync, getTotalBalanceAsync }
