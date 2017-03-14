import { Notifications } from 'exponent';
// import { Alert } from 'react-native';

import type { Transaction } from '../DataSources/TransactionsDS';
import type { Budget } from '../DataSources/BudgetsDS';
import { getBudgetAsync } from  '../DataSources/BudgetsDS';
import { getSumOfTransactionsAsync } from  '../DataSources/TransactionsDS';
import { ExpensesCategories } from './Categories';
import CurrencyConverter from '../CurrencyConverter';


export default class BudgetChecker {

  static checkBudget(budget: Budget) {
    let toDate = new Date();
    let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1, 0, 0, 0, 0)
    getSumOfTransactionsAsync(budget.category, fromDate, toDate, (result) => {
      let monthTotal = result.amount * -1;
      let alertText;
      if (budget.budget < monthTotal) {
        alertText = this.getAlertText(budget.category, true, monthTotal, budget.budget);
        if (alertText) {
          Alert.alert(alertText.title, alertText.body);
        }
      } else if (budget.budget * budget.notificationThreshold < monthTotal) {
        alertText = this.getAlertText(budget.category, false, monthTotal, budget.budget * budget.notificationThreshold);
        if (alertText) {
          Alert.alert(alertText.title, alertText.body);
        }
      }
    });
  }

  static async checkBudgetAfterTransaction(transaction: Transaction): {title: string, body: string} {
    let budget = await getBudgetAsync(transaction.category);
    if (budget === undefined) {
      return;
    }
    let toDate = new Date();
    let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1, 0, 0, 0, 0)
    let sum = await getSumOfTransactionsAsync(transaction.category, fromDate, toDate);
    let convertedAmount = await CurrencyConverter.convertCurrency(transaction.currency, transaction.amount);
    let monthTotal = sum.amount * -1;
    if (budget.budget < monthTotal
      && budget.budget >= monthTotal + convertedAmount) {
        return this.getAlertText(transaction.category, true, monthTotal, budget.budget);
    } else if (budget.budget * budget.notificationThreshold < monthTotal
    && budget.budget * budget.notificationThreshold >= monthTotal + convertedAmount) {
      return this.getAlertText(transaction.category, false, monthTotal, budget.budget * budget.notificationThreshold);
    }
  }

  static async checkBudgetsAfterTransactions(transactions: Array<Transaction>) {
    let amountsPerCategory = [];
    for (transaction of transactions) {
      if (transaction.amount < 0) {
        let item = amountsPerCategory.find(item => item.category === transaction.category);
        if (item) {
          item.amount += transaction.amount;
        } else {
          amountsPerCategory.push({category: transaction.category, amount: transaction.amount, currency: transaction.currency});
        }
      }
    }
    let alertTexts = [];
    let alertText;
    for (item of amountsPerCategory) {
      alertText = await checkBudgetAfterTransaction({category: item.category, amount: item.amount, currency: item.currency});
      if (alertText) {
        alertTexts.push(alertText);
      }
    }
    // TODO: alert - all alerts together
    if (alertTexts.length === 1) {
      Alert.alert(alertTexts[0].title, alertTexts[0].body);
    } else if (alertTexts.length > 1) {
      let multiText = '';
      for (text of alertTexts) {
        multiText += text.title + '\n' + text.body + '\n';
      }
      Alert.alert('Překročeny rozpočty!', multiText);
    }
  }

  static getAlertText(category: string, overLimit: boolean, total: number, threshold: number): {title: string, body: string} {
    let title = 'Překročena hranice výdajů! (' + ExpensesCategories[category] + ')'
    let body = 'Vaše výdaje: ' + total + '\nHranice: ' + threshold;
    if (overLimit === true) {
      title = 'Překročen rozpočet! (' + ExpensesCategories[category] + ')'
      body = 'Vaše výdaje: ' + total + '\nRozpočet: ' + threshold;
    }
    // Alert.alert(title, body);
    return {title: title, body: body};
  }

  // static presentNotification(category: string, overLimit: boolean, total: number, threshold: number) {
  //   let title = 'Překročena hranice výdajů! (' + ExpensesCategories[category] + ')'
  //   let body = 'Vaše výdaje: ' + total + '\nHranice: ' + threshold;
  //   if (overLimit === true) {
  //     title = 'Překročen rozpočet! (' + ExpensesCategories[category] + ')'
  //     body = 'Vaše výdaje: ' + total + '\nRozpočet: ' + threshold;
  //   }
  //   Notifications.presentLocalNotificationAsync({
  //     title: title,
  //     body: body,
  //     data: {},
  //     ios: {
  //       sound: true,
  //     },
  //     android: {
  //       vibrate: true,
  //     }
  //   });
  // }

}
