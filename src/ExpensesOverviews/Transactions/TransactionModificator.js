import type { Transaction } from '../../Shared/DataSource';
import { saveTransaction, updateTransaction } from '../../Shared/DataSource';
import BudgetChecker from '../../Shared/BudgetChecker';

export default class TransactionModificator {

  static saveTransaction(transaction: Transaction) {
    saveTransaction(transaction);
    BudgetChecker.checkBudgetAfterTransaction(transaction);
  }

  static updateTransaction(oldTransaction: Transaction, newTransaction: Transaction) {
    updateTransaction(oldTransaction, newTransaction);
    BudgetChecker.checkBudgetAfterTransaction(newTransaction);
  }
}
