/* @flow */
import { Alert } from 'react-native';

import type { Transaction } from '../../DataSources/TransactionsDS';
import { saveTransactionAsync, updateTransactionAsync } from '../../DataSources/TransactionsDS';
import BudgetChecker from '../../Shared/BudgetChecker';

export default class TransactionModificator {

  static saveTransaction(transaction: Transaction) {
    saveTransactionAsync(transaction, async (result) => {
      let alertText = await BudgetChecker.checkBudgetAfterTransaction(transaction);
      if (alertText) {
        Alert.alert(alertText.title, alertText.body);
      }
    });
  }

  static updateTransaction(oldTransaction: Transaction, newTransaction: Transaction) {
    updateTransactionAsync(oldTransaction, newTransaction, async (result) => {
      let alertText = await BudgetChecker.checkBudgetAfterTransaction(transaction);
      if (alertText) {
        Alert.alert(alertText.title, alertText.body);
      }
    });
  }
}
