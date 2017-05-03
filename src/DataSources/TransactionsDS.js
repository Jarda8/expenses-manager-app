/* @flow */
import EventEmitter from 'EventEmitter';

import { DB } from './DB';
import type { Account } from './AccountsDS';
import { getAccountAsync, updateAccountAsync } from './AccountsDS';
import { All, ExpensesCategories } from '../Shared/Categories'
import CurrencyConverter from '../CurrencyConverter';

const TRANSACTIONS_DS_EVENT_EMITTER = new EventEmitter();

export type Transaction = {
  _id: number,
  accountId: number,
  category: string,
  amount: number,
  currency: string,
  date: Date,
  note: string, // payer note
  accountParty: {
    info: string, // name of transaction party. For ATM transaction, masked card number used in transaction
    description: string, // whole account number including bank of transaction party. For ATM transaction, address of ATM if known. For card transaction, identification (name) of the merchant.
    iban: string,
    bic: string,
    accountNumber: string,
    prefix: string,
    bankCode: string
  },
  constantSymbol: string,
  variableSymbol: string,
  specificSymbol: string,
  description: string, // user description of the transaction
  payeeNote: string
}

async function saveTransactionAsync(transaction: Transaction, callback: any) {
  return new Promise((resolve,reject) => {
    DB.transactions.add(transaction, result => {
      TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged', {});
      getAccountAsync(transaction.accountId, account => {
        updateAccountAsync(account, {balance: account.balance + transaction.amount}, updateResult => {
          if (callback) {
            callback();
          }
          resolve();
        });
      });
    });
  });
}

function compareTransactionsByDate(a: Transaction, b: Transaction): number {
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

function deleteTransactionAsync(transaction: Transaction) {
  DB.transactions.remove_id(transaction._id, result =>
    TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged', {}));
  getAccountAsync(transaction.accountId, account =>
    updateAccountAsync(account, {balance: account.balance - transaction.amount}));
}

function deleteTransactionsByAccountIdAsync(accountId: number) {
  DB.transactions.remove({accountId: accountId}, result =>
    TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged', {}));
}

function updateTransactionAsync(oldTransaction: Transaction, newTransaction: Transaction, callback: any) {
  DB.transactions.update({_id: oldTransaction._id}, newTransaction, result => {
    TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged', {});
    callback(result);
  });
  getAccountAsync(oldTransaction.accountId, oldAccount =>
    updateAccountAsync(oldAccount, {balance: oldAccount.balance - oldTransaction.amount}, res =>
      getAccountAsync(newTransaction.accountId, newAccount =>
        updateAccountAsync(newAccount, {balance: newAccount.balance + newTransaction.amount})
      )
    )
  );
}

async function addTransactions(category: string, transactions: Array<Transaction>): {name: string, amount: number} {
  let convertedTransactions = await convertTransactionsToCrowns(transactions);
  return convertedTransactions.reduce((x, y) => {return {name: category, amount: x.amount + y.amount}}, {name: category, amount: 0});
}

async function convertTransactionsToCrowns(transactions: Array<Transaction>) {
  let result = [];
  for (transaction of transactions) {
      let convertedAmount = await CurrencyConverter.convertCurrency(transaction.currency, transaction.amount);
      result.push({amount: convertedAmount});
  }
  return result;
}

async function getSumOfTransactionsAsync(category: string, fromDate: Date, toDate: Date, callback: (p: {name: string, amount: number}) => any): Object {
  return new Promise((resolve,reject) => {
    getTransactionsAsync(category, fromDate, toDate, transactions => {
      addTransactions(category, transactions).then((total) => {
        if (callback) {
          callback(total);
        } else {
          resolve(total);
        }
      })
    });
  });
}

function getSumOfIncomesAsync(fromDate: Date, toDate: Date, callback: (p: {name: string, amount: number}) => any): void {
  getTransactionsAsync(All, fromDate, toDate, transactions => {
    parseDates(transactions);
    transactions = transactions.filter(t => t.amount > 0);
    addTransactions(All, transactions).then((sum) => {
      callback(sum);
    });
  })
}

function getSumOfExpensesAsync(fromDate: Date, toDate: Date, callback: (p: {name: string, amount: number}) => any): void {
  getTransactionsAsync(All, fromDate, toDate, transactions => {
    parseDates(transactions);
    transactions = transactions.filter(t => t.amount < 0);
    addTransactions(All, transactions).then((sum) => {
      callback(sum);
    });
  })
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

function wipeAllTransactions() {
  DB.transactions.erase_db(removedData => TRANSACTIONS_DS_EVENT_EMITTER.emit('transactionsChanged', {}));
}

export { TRANSACTIONS_DS_EVENT_EMITTER, getTransactionsAsync, deleteTransactionAsync, updateTransactionAsync, saveTransactionAsync, getSumOfTransactionsAsync, getSumOfIncomesAsync, getSumOfExpensesAsync, getSumsOfExpensesByCategoryAsync, deleteTransactionsByAccountIdAsync, wipeAllTransactions }
