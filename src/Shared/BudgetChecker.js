import { Notifications } from 'exponent';

import type { Transaction } from './DataSource';
import { getBudget, getSumOfTransactions } from  './DataSource';
import { ExpensesCategories } from './Categories';
import type { Budget } from './DataSource';


export default class BudgetChecker {

  // Toto bude možná potřeba pro zobrazení notifikace na iOS, pokud je apliakce v popředí.
  // Možná to platí jenom pro push notifikace.
  // viz. https://docs.getexponent.com/versions/v12.0.0/guides/push-notifications.html#handle-receiving-and-or-selecting-the-notification
  // componentWillMount() {
  //   this._notificationSubscription = Notifications.addListener(this._handleNotification);
  // }
  //
  // componentWillUnmount() {
  //   this._notificationSubscription && this._notificationSubscription.remove();
  // }
  //
  // _handleNotification = (notification) => {};

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
    let budget = getBudget(transaction.category);
    if (budget === undefined) {
      return;
    }
    let toDate = new Date();
    let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1, 0, 0, 0, 0)
    let monthTotal = getSumOfTransactions(transaction.category, fromDate, toDate).amount * -1;

    if (budget.budget < monthTotal
      && budget.budget >= monthTotal + transaction.amount) {
      this.presentNotification(transaction.category, true, monthTotal, budget.budget);
    } else if (budget.budget * budget.notificationThreshold < monthTotal
    && budget.budget * budget.notificationThreshold >= monthTotal + transaction.amount) {
      this.presentNotification(transaction.category, false, monthTotal, budget.budget * budget.notificationThreshold);
    }
  }

  static presentNotification(category: string, overLimit: boolean, total: number, threshold: number) {
    let title = 'Překročena stanovená hranice výdajů! (' + ExpensesCategories[category] + ')'
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
