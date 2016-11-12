/* @flow */
import React, { Component } from 'react';

import MainContent from './MainContent'
import { ExpensesBarchart } from './ExpensesBarchart'

export default class MainContentPieChart extends Component {

  static route = {
    navigationBar: {
      title: 'Expenses Bar Chart'
    },
  }

  render() {
    return (
      <MainContent>
        <ExpensesBarchart/>
      </MainContent>
    );
  }
}
