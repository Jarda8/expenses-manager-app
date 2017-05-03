import { Notifications } from 'exponent';

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

  static async checkBudgetsAfterTransactions(transactions: Array<Transaction>): {title: string, body: string} {
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
      alertText = await this.checkBudgetAfterTransaction({category: item.category, amount: item.amount, currency: item.currency});
      if (alertText) {
        alertTexts.push(alertText);
      }
    }
    if (alertTexts.length === 1) {
      return alertTexts[0];
    } else if (alertTexts.length > 1) {
      let multiText = '';
      for (text of alertTexts) {
        multiText += text.title + '\n' + text.body + '\n';
      }
      return {title: 'Překročeny rozpočty!', body: multiText};
    }
  }

  static getAlertText(category: string, overLimit: boolean, total: number, threshold: number): {title: string, body: string} {
    let title = 'Překročena hranice výdajů! (' + ExpensesCategories[category] + ')'
    let body = 'Vaše výdaje: ' + total + '\nHranice: ' + threshold;
    if (overLimit === true) {
      title = 'Překročen rozpočet! (' + ExpensesCategories[category] + ')'
      body = 'Vaše výdaje: ' + total + '\nRozpočet: ' + threshold;
    }
    return {title: title, body: body};
  }

}
