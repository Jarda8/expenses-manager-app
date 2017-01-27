import EventEmitter from 'EventEmitter';

import { DB } from './DB';

const BUDGETS_DS_EVENT_EMITTER = new EventEmitter();

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

function getBudgetsAsync(callback: (p: Array<Budget>) => any) {
  DB.budgets.get_all(result => {
    let resultArray: Array<Budget> = [];
    Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
    callback(resultArray);
  });
}

function getBudget(category: string): Budget {
  return budgetsDS.find((budget) => budget.category === category);
}

function getBudgetAsync(category: string, callback: (p: Budget) => any) {
  DB.budgets.get({category: category}, result => callback(result[0]));
}

function saveBudget(budget: Budget) {
  budgetsDS.push(budget);
}

function saveBudgetAsync(budget: Budget) {
  DB.budgets.add(budget, result => BUDGETS_DS_EVENT_EMITTER.emit('budgetsChanged'));
  // DB.budgets.erase_db();
  // DB.transactions.erase_db();
}

function updateBudget(oldBudget: Budget, newBudget: Budget) {
  let index = budgetsDS.indexOf(oldBudget);
  budgetsDS[index] = newBudget;
}

function updateBudgetAsync(oldBudget: Budget, newBudget: Budget) {
  DB.budgets.update(oldBudget, newBudget, result => BUDGETS_DS_EVENT_EMITTER.emit('budgetsChanged'));
}

function deleteBudget(budget: Budget) {
  let index = budgetsDS.indexOf(budget);
  budgetsDS.splice(index, 1);
}

function deleteBudgetAsync(budget: Budget) {
  DB.budgets.remove(budget, result => BUDGETS_DS_EVENT_EMITTER.emit('budgetsChanged'));
}

export { BUDGETS_DS_EVENT_EMITTER, getBudgets, saveBudget, updateBudget, deleteBudget, getBudget, getBudgetsAsync, saveBudgetAsync, updateBudgetAsync, deleteBudgetAsync, getBudgetAsync }
