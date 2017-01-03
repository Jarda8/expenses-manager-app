/* @flow */
import React, { Component } from 'react';

import ExpensesView from '../ExpensesView';
import { ExpensesPiechart } from './ExpensesPiechart';

export default class ExpensesPieChartView extends Component {

  static route = {
    navigationBar: {
      title: 'Výdaje'
    },
  }

  render() {
    return (
      <ExpensesView navigator={this.props.navigator}>
        <ExpensesPiechart/>
      </ExpensesView>
    );
  }
}
