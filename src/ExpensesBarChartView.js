/* @flow */
import React, { Component } from 'react';

import ExpensesView from './ExpensesView'
import { ExpensesBarchart } from './ExpensesBarchart'
import CategorySelector from './CategorySelector'

export default class ExpensesBarChartView extends Component {

  static route = {
    navigationBar: {
      title: 'Expenses Bar Chart'
    },
  }

  render() {
    return (
      <ExpensesView>
        <CategorySelector />
        <ExpensesBarchart />
      </ExpensesView>
    );
  }
}
