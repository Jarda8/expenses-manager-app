import EventEmitter from 'EventEmitter';

import { DB } from './DB';

const BUDGETS_DS_EVENT_EMITTER = new EventEmitter();

export type Budget = {
  _id: number,
  category: string,
  budget: number,
  notificationThreshold: number
}

function getBudgetsAsync(callback: (p: Array<Budget>) => any) {
  DB.budgets.get_all(result => {
    let resultArray: Array<Budget> = [];
    Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
    callback(resultArray);
  });
}

function getBudgetAsync(category: string, callback: (p: Budget) => any) {
  DB.budgets.get({category: category}, result => callback(result[0]));
}

function saveBudgetAsync(budget: Budget) {
  DB.budgets.add(budget, result => BUDGETS_DS_EVENT_EMITTER.emit('budgetsChanged'));
}

function updateBudgetAsync(oldBudget: Budget, newBudget: Budget) {
  DB.budgets.update(oldBudget, newBudget, result => BUDGETS_DS_EVENT_EMITTER.emit('budgetsChanged'));
}

function deleteBudgetAsync(budget: Budget) {
  DB.budgets.remove(budget, result => BUDGETS_DS_EVENT_EMITTER.emit('budgetsChanged'));
}

export { BUDGETS_DS_EVENT_EMITTER, getBudgetsAsync, saveBudgetAsync, updateBudgetAsync, deleteBudgetAsync, getBudgetAsync }
