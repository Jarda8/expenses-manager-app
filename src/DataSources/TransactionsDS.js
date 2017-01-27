import EventEmitter from 'EventEmitter';

import { DB } from './DB';
import type { Account } from './AccountsDS';
import { getAccount, updateAccount, getAccountAsync, updateAccountAsync } from './AccountsDS';
import { All, ExpensesCategories } from '../Shared/Categories'

const TRANSACTIONS_DS_EVENT_EMITTER = new EventEmitter();

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
];

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

function saveTransactionAsync(transaction: Transaction, callback: any) {
  DB.transactions.add(transaction, result => {
    TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged');
    callback(result);
  });
  // DB.transactions.erase_db();

  getAccountAsync(transaction.accountName, transaction.accountNumber, account =>
    updateAccountAsync(account, {balance: account.balance + transaction.amount}));

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

function parseDates(transactions: Array<Transaction>) {
  for (transaction of transactions) {
    transaction.date = new Date(transaction.date);
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

function getTransactionsAsync(category: string, fromDate: Date, toDate: Date, callback: (p: Array<Transaction>) => any): Array<Transaction> {

  if (category === All) {
    DB.transactions.get_all(result => {
      let resultArray: Array<Transaction> = [];
      Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
      parseDates(resultArray);
      resultArray = resultArray.filter(t => t.date >= fromDate && t.date <= toDate);
      callback(resultArray.sort(compareTransactionsByDate));
    });
  } else {
    DB.transactions.get({category: category}, result => {
      parseDates(result);
      result = result.filter(t => t.date >= fromDate && t.date <= toDate);
      callback(result.sort(compareTransactionsByDate));
    });
  }
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

function deleteTransactionAsync(transaction: Transaction) {
  DB.transactions.remove_id(transaction._id, result =>
    TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged'));

  getAccountAsync(transaction.accountName, transaction.accountNumber, account =>
    updateAccountAsync(account, {balance: account.balance - transaction.amount}));
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

function updateTransactionAsync(oldTransaction: Transaction, newTransaction: Transaction, callback: any) {
  DB.transactions.update({_id: oldTransaction._id}, newTransaction, result => {
    TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged');
    callback(result);
  });

  getAccountAsync(oldTransaction.accountName, oldTransaction.accountNumber, oldAccount =>
    updateAccountAsync(oldAccount, {balance: oldAccount.balance - oldTransaction.amount}, res =>
      getAccountAsync(newTransaction.accountName, newTransaction.accountNumber, newAccount =>
        updateAccountAsync(newAccount, {balance: newAccount.balance + newTransaction.amount})
      )
    )
  );
}

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

function getSumOfTransactionsAsync(category: string, fromDate: Date, toDate: Date, callback: (p: {name: string, amount: number}) => any): void {
  getTransactionsAsync(category, fromDate, toDate, transactions => {
    callback(addTransactions(category, transactions))
  });
}

function getSumOfIncomes(fromDate: Date, toDate: Date): {name: string, amount: number} {
  let transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate && t.amount > 0);
  return addTransactions(All, transactions);
}

function getSumOfIncomesAsync(fromDate: Date, toDate: Date, callback: (p: {name: string, amount: number}) => any): void {
  getTransactionsAsync(All, fromDate, toDate, transactions => {
    parseDates(transactions);
    transactions = transactions.filter(t => t.amount > 0);
    callback(addTransactions(All, transactions));
  })
}

function getSumOfExpenses(fromDate: Date, toDate: Date): {name: string, amount: number} {
  let transactions = transactionsDS.filter((t) => t.date >= fromDate && t.date <=toDate && t.amount < 0);
  return addTransactions(All, transactions);
}

function getSumOfExpensesAsync(fromDate: Date, toDate: Date, callback: (p: {name: string, amount: number}) => any): void {
  getTransactionsAsync(All, fromDate, toDate, transactions => {
    parseDates(transactions);
    transactions = transactions.filter(t => t.amount < 0);
    callback(addTransactions(All, transactions));
  })
}

function getSumsOfExpensesByCategory(fromDate: Date, toDate: Date): Array<{name: string, amount: number}> {
  return (
    Object.keys(ExpensesCategories)
    .map((category) => getSumOfTransactions(category, fromDate, toDate))
    .filter((sum) => sum.amount !== 0)
  );
}

function getSumsOfTransactionsAsyncRecur(categories: Array<string>, fromDate: Date, toDate: Date, resultArray: Array<any>, callback: any): void {
  if (categories.length > 0) {
    getSumOfTransactionsAsync(categories[0], fromDate, toDate, result => {
      categories.splice(0, 1);
      resultArray.push(result);
      getSumsOfTransactionsAsyncRecur(categories, fromDate, toDate, resultArray, callback);
    });
  } else {
    callback(resultArray.filter((sum) => sum.amount !== 0));
  }
}

function getSumsOfExpensesByCategoryAsync(fromDate: Date, toDate: Date, callback: (p: Array<{name: string, amount: number}>) => any): void {
  let categories = Object.keys(ExpensesCategories);
  getSumsOfTransactionsAsyncRecur(categories, fromDate, toDate, [], callback);
}

export { TRANSACTIONS_DS_EVENT_EMITTER, getTransactions, deleteTransaction, updateTransaction, saveTransaction, getSumOfTransactions, getSumOfIncomes, getSumOfExpenses, getSumsOfExpensesByCategory, getTransactionsAsync, deleteTransactionAsync, updateTransactionAsync, saveTransactionAsync, getSumOfTransactionsAsync, getSumOfIncomesAsync, getSumOfExpensesAsync, getSumsOfExpensesByCategoryAsync }
