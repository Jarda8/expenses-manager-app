/* @flow */
import React, { Component } from 'react';

import ExpensesView from '../ExpensesView';
import { ExpensesBarchart } from './ExpensesBarchart';
import CategorySelector from '../../Shared/CategorySelector';

export default class ExpensesBarChartView extends Component {

  static route = {
    navigationBar: {
      title: 'Výdaje v čase'
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
