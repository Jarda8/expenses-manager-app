import { DB } from './DB';

export type Account = {
  name: string,
  number: string,
  bankName: string,
  type: string,
  balance: number,
  currency: string
}

var accountTypes = new Map();
accountTypes.set('Personal account', 'Osobní účet');
accountTypes.set('Payment card', 'Platební karta');
accountTypes.set('Cash', 'Hotovost');

var accountsDS: Array<Account> = [
  {name: 'Osobní účet', number: '123465798', bankName: 'Česká spořitelna', type: 'Personal account', balance: 19500, currency: 'CZK'},
  {name: 'Peněženka', number: null, bankName: null, type: 'Cash', balance: 2154, currency: 'CZK'}
]

function getAccounts(): Array<Account> {
  accounts = DB.get_all
  return accountsDS;
}

function getAccountsAsync(callback: (result: Array<Account>) => void) {

  // DB.accounts.erase_db(() => {});
  // console.log('baf');
  // DB.accounts.add({name: 'Osobní účet', number: '123465798', bankName: 'Česká spořitelna', type: 'Personal account', balance: 19500, currency: 'CZK'});
  // DB.accounts.add({name: 'Peněženka', number: null, bankName: null, type: 'Cash', balance: 2154, currency: 'CZK'});

  DB.accounts.get_all(result => {
    let resultArray: Array<Account> = [];
    Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
    callback(resultArray);
  });
}

function getAccount(name: string, number: string) {
  return accountsDS.find((acc) => acc.name === name && acc.number === number);
}

function getAccountAsync(name: string, number: string, callback: (result: Account) => void) {
  console.log('getAccountAsync');
  console.log('name:');
  console.log(name);
  console.log('number:');
  console.log(number);
  DB.accounts.get({name: name, number: number}, result => {
    callback(result[0]);
  });
}

function saveAccount(account: Account) {
  accountsDS.push(account);
}

function saveAccountAsync(account: Account) {
  DB.accounts.add(account);
}

function updateAccount(oldAccount: Account, newAccount: Account) {
  let index = accountsDS.indexOf(oldAccount);
  accountsDS[index] = newAccount;
}

function updateAccountAsync(oldAccount: Account, newAccount: Account, callback: any) {
  console.log('updateAccountAsync');
  console.log('oldAccount:');
  console.log(oldAccount);
  console.log('newAccount:');
  console.log(newAccount);
  DB.accounts.update(oldAccount, newAccount, callback);
}

function deleteAccount(account: Account) {
  let index = accountsDS.indexOf(account);
  accountsDS.splice(index, 1);
}

function deleteAccountAsync(account: Account) {
  DB.accounts.remove(account);
}

function getTotalBalance() {
  return accountsDS.reduce((x, y) => {return {balance: x.balance + y.balance}}).balance;
}

function getTotalBalanceAsync(callback: (result: number) => void) {
  getAccountsAsync(result => {
    callback(result.reduce((x, y) => {return {balance: x.balance + y.balance}}).balance);
  });
}

export { accountTypes, getAccount, getAccounts, saveAccount, updateAccount, deleteAccount, getTotalBalance, getAccountAsync, getAccountsAsync, saveAccountAsync, updateAccountAsync, deleteAccountAsync, getTotalBalanceAsync }
