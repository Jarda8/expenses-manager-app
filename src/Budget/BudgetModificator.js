import type { Budget } from '../DataSources/BudgetsDS';
import { saveBudgetAsync, updateBudgetAsync } from '../DataSources/BudgetsDS';
import BudgetChecker from '../Shared/BudgetChecker';

export default class BudgetModificator {

  static saveBudget(budget: Budget) {
    saveBudgetAsync(budget);
    // TODO: volat v callbacku nebo .then...
    BudgetChecker.checkBudget(budget);
  }

  static updateBudget(oldBudget: Budget, newBudget: Budget) {
    updateBudgetAsync(oldBudget, newBudget);
    // TODO: volat v callbacku nebo .then...
    BudgetChecker.checkBudget(newBudget);
  }
}
