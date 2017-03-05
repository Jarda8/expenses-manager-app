/* @flow */
import EventEmitter from 'EventEmitter';
import CurrencyConverter from '../CurrencyConverter';

import { DB } from './DB';

const ACCOUNTS_DS_EVENT_EMITTER = new EventEmitter();

export type Account = {
  _id: number,
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
    callback(resultArray);
  });
}

function getAccountAsync(id: number, callback: (result: Account) => void) {
  DB.accounts.get_id(id, result => {
    callback(result[0]);
  });
}

function saveAccountAsync(account: Account) {
  DB.accounts.add(account, result => ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged'));
}

function updateAccountAsync(oldAccount: Account, newAccount: Account, callback: any) {
  DB.accounts.update(oldAccount, newAccount, result => {
    ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged');
    if (callback) {
      callback(result);
    }
  });
}

function updateAccountByIdAsync(id: number, newData: Object, callback: any) {
  DB.accounts.update_id(id, newData, result => {
    ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged');
    if (callback) {
      callback(result);
    }
  });
}

function deleteAccountAsync(account: Account) {
  DB.accounts.remove(account, result => ACCOUNTS_DS_EVENT_EMITTER.emit('accountsChanged'));
}

function getTotalBalanceAsync(callback: (result: number) => void) {
  getAccountsAsync((accounts) => {
    convertToCrowns(accounts).then(() => {
      callback(accounts.reduce((x, y) => {return {balance: x.balance + y.balance}}, {balance: 0}).balance);
    })
  });
}

async function convertToCrowns(accounts: Array<Account>) {
  for (account of accounts) {
    account.balance = await CurrencyConverter.convertCurrency(account.currency, account.balance);
  }
}

export { ACCOUNTS_DS_EVENT_EMITTER, accountTypes, getAccountAsync, getAccountsAsync, saveAccountAsync, updateAccountAsync, updateAccountByIdAsync, deleteAccountAsync, getTotalBalanceAsync }
