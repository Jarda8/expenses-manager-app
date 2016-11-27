/* @flow */
import Exponent from 'exponent';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { createRouter, NavigationProvider, } from '@exponent/ex-navigation';
import { FormattedWrapper } from 'react-native-globalize';

import DrawerNavigationPanel from './src/DrawerNavigationPanel'
import ExpensesPieChartView from './src/ExpensesPieChartView'
import ExpensesBarChartView from './src/ExpensesBarChartView'
import AccountsView from './src/AccountsView'

export const Router = createRouter(() => ({
  pieChart: () => ExpensesPieChartView,
  barChart: () => ExpensesBarChartView,
  accounts: () => AccountsView
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
