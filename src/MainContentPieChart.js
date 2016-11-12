/* @flow */
import React, { Component } from 'react';

import MainContent from './MainContent'
import { ExpensesPiechart } from './ExpensesPiechart'

export default class MainContentPieChart extends Component {

  static route = {
    navigationBar: {
      title: 'Expenses Pie Chart'
    },
  }

  render() {
    return (
      <MainContent>
        <ExpensesPiechart/>
      </MainContent>
    );
  }
}
