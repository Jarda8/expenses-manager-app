/* @flow */
import React, { Component } from 'react';

import NewTransaction from './NewTransaction';
import { ExpensesCategories } from '../Shared/Categories'


export default class NewExpense extends Component {

  static route = {
    navigationBar: {
      title: 'Nový výdaj'
    },
  }

  render() {
    return (
      <NewTransaction
        categories={ExpensesCategories}
        ifExpenseMinusOne={-1}
        navigator={this.props.navigator}/>
    );
  }
}
