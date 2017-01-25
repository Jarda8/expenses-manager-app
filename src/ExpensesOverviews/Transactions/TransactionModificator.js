import type { Transaction } from '../../DataSources/TransactionsDS';
import { saveTransactionAsync, updateTransactionAsync } from '../../DataSources/TransactionsDS';
import BudgetChecker from '../../Shared/BudgetChecker';

export default class TransactionModificator {

  static saveTransaction(transaction: Transaction) {
    saveTransactionAsync(transaction, result =>
      BudgetChecker.checkBudgetAfterTransaction(transaction));
  }

  static updateTransaction(oldTransaction: Transaction, newTransaction: Transaction) {
    updateTransactionAsync(oldTransaction, newTransaction, result =>
      BudgetChecker.checkBudgetAfterTransaction(newTransaction));
  }
}
