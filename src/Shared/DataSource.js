/* @flow */
import { All, ExpensesCategories } from './Categories'

var periods = new Map();
periods.set('year', 'year');
periods.set('month', 'month');
periods.set('week', 'week');
periods.set('custom', 'custom');

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
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'WAGES', amount: 22500, date: new Date(2017, 0, 1, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -160, date: new Date(2017, 0, 4, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'TRANSPORT', amount: -120, date: new Date(2017, 0, 4, 0, 0, 0, 0), note: 'vlak do Pardubic'},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -65, date: new Date(2017, 0, 5, 0, 0, 0, 0), note: 'kebab'},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'TRANSPORT', amount: -120, date: new Date(2017, 0, 5, 0, 0, 0, 0), note: 'vlak z Pardubic'},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'CLOTHES', amount: -1150, date: new Date(2017, 0, 8, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -420, date: new Date(2017, 0, 17, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'ENTERTAINMENT', amount: -380, date: new Date(2017, 0, 10, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -148, date: new Date(2017, 0, 10, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -160, date: new Date(2017, 0, 25, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'TRANSPORT', amount: -120, date: new Date(2017, 0, 28, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -65, date: new Date(2017, 0, 28, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'ENTERTAINMENT', amount: -200, date: new Date(2016, 11, 8, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'HEALTH', amount: -321, date: new Date(2016, 11, 31, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'TRANSPORT', amount: -420, date: new Date(2016, 11, 1, 0, 0, 0, 0), note: ''},
  {accountName: 'Osobní účet', accountNumber: '123465798', category: 'FOOD', amount: -120, date: new Date(2016, 11, 17, 0, 0, 0, 0), note: ''}
]

function saveTransaction(transaction: Transaction) {
  transactionsDS.push(transaction);
}

function getTransactions(category: string, fromDate: Date, toDate: Date): Array<Transaction> {
  let transactions;
  if (category === All) {
    transactions = transactionsDS.filter((t) =>
    t.date >= fromDate && t.date <= toDate);
  } else {
    transactions = transactionsDS.filter((t) =>
    t.category === category && t.date >= fromDate && t.date <= toDate);
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

// function getSumOfTransactions(category: string, fromDate: Date, toDate: Date) {
//   let transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate);
//   let amounts = transactions.map((t) => t.amount);
//   return amounts.reduce((x, y) => x + y, 0);
// }

function addTransactions(category: string, transactions: Array<Transaction>): {name: string, amount: number} {
  return transactions.reduce((x, y) => {return {name: category, amount: x.amount + y.amount}}, {name: category, amount: 0});
}

function getSumOfTransactions(category: string, fromDate: Date, toDate: Date): {name: string, amount: number} {
  let transactions;
  if (category === All) {
    transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate);
  } else {
    transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate && t.category === category);
  }
  return addTransactions(category, transactions);
}

function getSumOfIncomes(fromDate: Date, toDate: Date): {name: string, amount: number} {
  let transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate && t.amount > 0);
  return addTransactions(All, transactions);
}

function getSumOfExpenses(fromDate: Date, toDate: Date): {name: string, amount: number} {
  let transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate && t.amount < 0);
  return addTransactions(All, transactions);
}

function getSumsOfExpensesByCategory(fromDate: Date, toDate: Date): Array<{name: string, amount: number}> {
  return (
    Object.keys(ExpensesCategories)
    .map((category) => getSumOfTransactions(category, fromDate, toDate))
    .filter((sum) => sum.amount !== 0)
  );
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

function getBudget(category: string): Budget {
  return budgetsDS.find((budget) => budget.category === category);
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

export { periods, accountTypes, banks, accountsDS, getAccount, getAccounts, saveAccount, updateAccount, currencies, deleteAccount, transactionsDS, getTransactions, deleteTransaction, updateTransaction, saveTransaction, getBudgets, saveBudget, updateBudget, deleteBudget, getBudget, getSumOfTransactions, getSumOfIncomes, getSumOfExpenses, getSumsOfExpensesByCategory }
