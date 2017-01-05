/* @flow */
import Exponent from 'exponent';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { createRouter, NavigationProvider, } from '@exponent/ex-navigation';
import { FormattedWrapper } from 'react-native-globalize';

import DrawerNavigationPanel from './src/DrawerNavigationPanel';
import ExpensesPieChartView from './src/ExpensesOverviews/PieChart/ExpensesPieChartView';
import ExpensesBarChartView from './src/ExpensesOverviews/BarChart/ExpensesBarChartView';
import AccountsListView from './src/Accounts/AccountsListView';
import TransactionsListView from './src/ExpensesOverviews/Transactions/TransactionsListView';
import BudgetListView from './src/Budget/BudgetListView';
import CalculatorView from './src/CalculatorView';
import NewExpense from './src/NewTransaction/NewExpense';
import NewIncome from './src/NewTransaction/NewIncome';
import CategoriesList from './src/NewTransaction/CategoriesList';

export const Router = createRouter(() => ({
  pieChart: () => ExpensesPieChartView,
  barChart: () => ExpensesBarChartView,
  accounts: () => AccountsListView,
  transactions: () => TransactionsListView,
  budgets: () => BudgetListView,
  calculator: () => CalculatorView,
  categories: () => CategoriesList,
  newExpense: () => NewExpense,
  newIncome: () => NewIncome
}));

class App extends Component {
  render() {
    return (
      <FormattedWrapper locale="cs" currency="CZK">
        <NavigationProvider router={Router}>
          <StatusBar barStyle="light-content" />
          <DrawerNavigationPanel />
        </NavigationProvider>
      </FormattedWrapper>
    );
  }
}

Exponent.registerRootComponent(App);
