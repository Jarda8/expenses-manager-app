/* @flow */
import { All, ExpensesCategories } from './Categories'

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

export { periods, banks, currencies, getBudgets, saveBudget, updateBudget, deleteBudget, getBudget }
