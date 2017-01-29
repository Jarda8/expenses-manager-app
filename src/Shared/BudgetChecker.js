import { Notifications } from 'exponent';
import { Alert } from 'react-native';

import type { Transaction } from '../DataSources/TransactionsDS';
import type { Budget } from '../DataSources/BudgetsDS';
import { getBudgetAsync } from  '../DataSources/BudgetsDS';
import { getSumOfTransactions, getSumOfTransactionsAsync } from  '../DataSources/TransactionsDS';
import { ExpensesCategories } from './Categories';


export default class BudgetChecker {

  static checkBudget(budget: Budget) {
    let toDate = new Date();
    let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1, 0, 0, 0, 0)
    let monthTotal = getSumOfTransactions(budget.category, fromDate, toDate).amount * -1;

    if (budget.budget < monthTotal) {
      this.presentNotification(budget.category, true, monthTotal, budget.budget);
    } else if (budget.budget * budget.notificationThreshold < monthTotal) {
      this.presentNotification(budget.category, false, monthTotal, budget.budget * budget.notificationThreshold);
    }
  }

  static checkBudgetAfterTransaction(transaction: Transaction) {
    getBudgetAsync(transaction.category, budget => {
      if (budget === undefined) {
        return;
      }
      let toDate = new Date();
      let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1, 0, 0, 0, 0)
      getSumOfTransactionsAsync(transaction.category, fromDate, toDate, result => {
          let monthTotal = result.amount * -1;
          if (budget.budget < monthTotal
            && budget.budget >= monthTotal + transaction.amount) {
            this.showAlert(transaction.category, true, monthTotal, budget.budget);
          } else if (budget.budget * budget.notificationThreshold < monthTotal
          && budget.budget * budget.notificationThreshold >= monthTotal + transaction.amount) {
            this.showAlert(transaction.category, false, monthTotal, budget.budget * budget.notificationThreshold);
          }
      });
    });
  }

  static showAlert(category: string, overLimit: boolean, total: number, threshold: number) {
    let title = 'Překročena hranice výdajů! (' + ExpensesCategories[category] + ')'
    let body = 'Vaše výdaje: ' + total + '\nHranice: ' + threshold;
    if (overLimit === true) {
      title = 'Překročen rozpočet! (' + ExpensesCategories[category] + ')'
      body = 'Vaše výdaje: ' + total + '\nRozpočet: ' + threshold;
    }
    Alert.alert(title, body);
  }

  static presentNotification(category: string, overLimit: boolean, total: number, threshold: number) {
    let title = 'Překročena hranice výdajů! (' + ExpensesCategories[category] + ')'
    let body = 'Vaše výdaje: ' + total + '\nHranice: ' + threshold;
    if (overLimit === true) {
      title = 'Překročen rozpočet! (' + ExpensesCategories[category] + ')'
      body = 'Vaše výdaje: ' + total + '\nRozpočet: ' + threshold;
    }
    Notifications.presentLocalNotificationAsync({
      title: title,
      body: body,
      data: {},
      ios: {
        sound: true,
      },
      android: {
        vibrate: true,
      }
    });
  }

}
