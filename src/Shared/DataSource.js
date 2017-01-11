/* @flow */
import { All } from './Categories'

var accountTypes = new Map();
accountTypes.set('Personal account', 'Osobní účet');
accountTypes.set('Payment card', 'Platební karta');
accountTypes.set('Cash', 'Hotovost');

export type Bank = {
  name: string,
  code: string
}

var banks: Array<Bank> = [
  {name: 'Česká spořitelna', code: "0800"}
]

export type Account = {
  name: string,
  number: string,
  bankName: string,
  type: string,
  balance: number,
  currency: string
}

var accountsDS: Array<Account> = [
  {name: 'Osobní účet', number: '123465798', bankName: 'Česká spořitelna', type: 'Personal account', balance: 19500, currency: 'CZK'},
  {name: 'Peněženka', number: null, bankName: null, type: 'Cash', balance: 2154, currency: 'CZK'}
]

function getAccounts(): Array<Account> {
  return accountsDS;
}

function getAccount(name: string, number: string) {
  return accountsDS.find((acc) => acc.name === name && acc.number === number);
}

function saveAccount(account: Account) {
  accountsDS.push(account);
}

function updateAccount(oldAccount: Account, newAccount: Account) {
  let index = accountsDS.indexOf(oldAccount);
  accountsDS[index] = newAccount;
}

function deleteAccount(account: Account) {
  let index = accountsDS.indexOf(account);
  accountsDS.splice(index, 1);
}

var currencies = ['CZK'];

export type Transaction = {
  accountName: string,
  accountNumber: string,
  category: string,
  amount: number,
  date: Date,
  note: string
}

var transactionsDS: Array<Transaction> = [
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'WAGES', amount: 22500, date: new Date('2016-11-01'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -160, date: new Date('2016-11-04'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'TRANSPORT', amount: -120, date: new Date('2016-11-04'), note: 'vlak do Pardubic'},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -65, date: new Date('2016-11-05'), note: 'kebab'},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'TRANSPORT', amount: -120, date: new Date('2016-11-05')},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'CLOTHES', amount: -1150, date: new Date('2016-11-08'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -420, date: new Date('2016-11-09'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'ENTERTAINMENT', amount: -380, date: new Date('2016-11-10'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -148, date: new Date('2016-11-10'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'ENTERTAINMENT', amount: -200, date: new Date('2016-12-08'), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -321, date: new Date('2016-12-31'), note: ''}
]

function saveTransaction(transaction: Transaction) {
  transactionsDS.push(transaction);
}

function getTransactions(category: string, date: Date): Array<Transaction> {
  let transactions;
  if (category === All) {
    transactions = transactionsDS.filter((t) =>
    t.date.getFullYear() === date.getFullYear()
    && t.date.getMonth() === date.getMonth());
  } else {
    transactions = transactionsDS.filter((t) =>
    t.category === category
    && t.date.getFullYear() === date.getFullYear()
    && t.date.getMonth() === date.getMonth());
  }
  return transactions;
}

function deleteTransaction(transaction: Transaction) {
  let index = transactionsDS.indexOf(transaction);
  transactionsDS.splice(index, 1);
}

function updateTransaction(oldTransaction: Transaction, newTransaction: Transaction) {
  let index = transactionsDS.indexOf(oldTransaction);
  transactionsDS[index] = newTransaction;
}

export type Budget = {
  category: string,
  budget: number,
  notificationThreshold: number
}

var budgetsDS: Array<Budget> = [
  {category: 'FOOD', budget: 5000, notificationThreshold: 0.8},
  {category: 'TRANSPORT', budget: 500, notificationThreshold: 0.8},
  {category: 'ENTERTAINMENT', budget: 1000, notificationThreshold: 0.5}
]

function getBudgets(): Array<Budget> {
  return budgetsDS;
}

function saveBudget(budget: Budget) {
  budgetsDS.push(budget);
}

function updateBudget(oldBudget: Budget, newBudget: Budget) {
  let index = budgetsDS.indexOf(oldBudget);
  budgetsDS[index] = newBudget;
}

function deleteBudget(budget: Budget) {
  let index = budgetsDS.indexOf(budget);
  budgetsDS.splice(index, 1);
}

export { accountTypes, banks, accountsDS, getAccount, getAccounts, saveAccount, updateAccount, currencies, deleteAccount, transactionsDS, getTransactions, deleteTransaction, updateTransaction, saveTransaction, getBudgets, saveBudget, updateBudget, deleteBudget }
