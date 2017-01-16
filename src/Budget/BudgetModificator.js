import type { Budget } from '../Shared/DataSource';
import { saveBudget, updateBudget } from '../Shared/DataSource';
import BudgetChecker from '../Shared/BudgetChecker';

export default class BudgetModificator {

  static saveBudget(budget: Budget) {
    saveBudget(budget);
    BudgetChecker.checkBudget(budget);
  }

  static updateBudget(oldBudget: Budget, newBudget: Budget) {
    updateBudget(oldBudget, newBudget);
    BudgetChecker.checkBudget(newBudget);
  }
}
