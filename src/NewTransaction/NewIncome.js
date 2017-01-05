/* @flow */
import React, { Component } from 'react';

import NewTransaction from './NewTransaction';
import { IncomeCategories } from '../Shared/Categories'


export default class NewIncome extends Component {

  static route = {
    navigationBar: {
      title: 'Nový příjem'
    },
  }

  render() {
    return (
      <NewTransaction
        categories={IncomeCategories}
        ifExpenseMinusOne={1}
        navigator={this.props.navigator}/>
    );
  }
}
