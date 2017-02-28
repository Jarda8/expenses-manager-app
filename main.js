/* @flow */
import Exponent from 'exponent';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { createRouter, NavigationProvider, } from '@exponent/ex-navigation';
import { FormattedWrapper } from 'react-native-globalize';
import 'babel-polyfill';

import DrawerNavigationPanel from './src/DrawerNavigationPanel';
import ExpensesPieChartView from './src/ExpensesOverviews/PieChart/ExpensesPieChartView';
import ExpensesBarChartView from './src/ExpensesOverviews/BarChart/ExpensesBarChartView';
import AccountsListView from './src/Accounts/AccountsListView';
import TransactionsListView from './src/ExpensesOverviews/Transactions/TransactionsListView';
import BudgetListView from './src/Budget/BudgetListView';
import NewExpense from './src/NewTransaction/NewExpense';
import NewIncome from './src/NewTransaction/NewIncome';
import CategoriesList from './src/NewTransaction/CategoriesList';
import EditTransaction from './src/ExpensesOverviews/Transactions/EditTransaction';
import NewAccount from './src/Accounts/NewAccount';
import EditAccount from './src/Accounts/EditAccount';
import CSTokensForm from './src/Authorization/CSTokensForm';
import NewBudget from './src/Budget/NewBudget';
import EditBudget from './src/Budget/EditBudget';
import NewTransfer from './src/Accounts/NewTransfer';

export const Router = createRouter(() => ({
  pieChart: () => ExpensesPieChartView,
  barChart: () => ExpensesBarChartView,
  accounts: () => AccountsListView,
  transactions: () => TransactionsListView,
  budgets: () => BudgetListView,
  categories: () => CategoriesList,
  newExpense: () => NewExpense,
  newIncome: () => NewIncome,
  editTransaction: () => EditTransaction,
  newAccount: () => NewAccount,
  editAccount: () => EditAccount,
  csTokensForm: () => CSTokensForm,
  newBudget: () => NewBudget,
  editBudget: () => EditBudget,
  newTransfer: () => NewTransfer
}));

class App extends Component {
  render() {
    return (
      <FormattedWrapper locale="cs" currency="CZK" cldr={[require('./localization/currencies-cs-cldr.json')]}>
        <NavigationProvider router={Router}>
          <StatusBar barStyle="light-content" />
          <DrawerNavigationPanel />
        </NavigationProvider>
      </FormattedWrapper>
    );
  }
}

Exponent.registerRootComponent(App);
