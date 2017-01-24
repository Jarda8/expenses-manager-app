/* @flow */
import { All, ExpensesCategories } from './Categories'
import { DB } from '../DataSources/DB';

var periods = new Map();
periods.set('year', 'year');
periods.set('month', 'month');
periods.set('week', 'week');
periods.set('custom', 'custom');

export type Bank = {
  name: string,
  code: string
}

var banks: Array<Bank> = [
  {name: 'Česká spořitelna', code: "0800"}
]

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

  let account = getAccount(transaction.accountName, transaction.accountNumber);
  updateAccount(account,
    {
      name: account.name,
      number: account.number,
      bankName: account.bankName,
      type: account.type,
      balance: account.balance + transaction.amount,
      currency: account.currency
    });
}

function compareTransactionsByDate(a: Transaction, b: Transaction) {
  if (a.date < b.date) {
    return 1;
  } else if (a.date > b.date) {
    return -1;
  } else {
    return 0;
  }
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
  return transactions.sort(compareTransactionsByDate);
}

function deleteTransaction(transaction: Transaction) {
  let index = transactionsDS.indexOf(transaction);
  transactionsDS.splice(index, 1);

  let account = getAccount(transaction.accountName, transaction.accountNumber);
  updateAccount(account,
    {
      name: account.name,
      number: account.number,
      bankName: account.bankName,
      type: account.type,
      balance: account.balance - transaction.amount,
      currency: account.currency
    });
}

function updateTransaction(oldTransaction: Transaction, newTransaction: Transaction) {
  let index = transactionsDS.indexOf(oldTransaction);
  transactionsDS[index] = newTransaction;


  let oldAccount = getAccount(oldTransaction.accountName, oldTransaction.accountNumber);
  updateAccount(oldAccount,
    {
      name: oldAccount.name,
      number: oldAccount.number,
      bankName: oldAccount.bankName,
      type: oldAccount.type,
      balance: oldAccount.balance - oldTransaction.amount,
      currency: oldAccount.currency
    });
  let newAccount = getAccount(newTransaction.accountName, newTransaction.accountNumber);
  updateAccount(newAccount,
    {
      name: newAccount.name,
      number: newAccount.number,
      bankName: newAccount.bankName,
      type: newAccount.type,
      balance: newAccount.balance + newTransaction.amount,
      currency: newAccount.currency
    });
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

export { periods, banks, currencies, transactionsDS, getTransactions, deleteTransaction, updateTransaction, saveTransaction, getBudgets, saveBudget, updateBudget, deleteBudget, getBudget, getSumOfTransactions, getSumOfIncomes, getSumOfExpenses, getSumsOfExpensesByCategory, }
