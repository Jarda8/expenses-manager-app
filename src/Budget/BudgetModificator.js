import type { Budget } from '../DataSources/BudgetsDS';
import { saveBudgetAsync, updateBudgetAsync } from '../DataSources/BudgetsDS';
import BudgetChecker from '../Shared/BudgetChecker';

export default class BudgetModificator {

  static saveBudget(budget: Budget) {
    saveBudgetAsync(budget);
    BudgetChecker.checkBudget(budget);
  }

  static updateBudget(oldBudget: Budget, newBudget: Budget) {
    updateBudgetAsync(oldBudget, newBudget);
    BudgetChecker.checkBudget(newBudget);
  }
}
