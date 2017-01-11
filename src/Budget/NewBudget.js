import React, { Component } from 'react';

import BudgetForm from './BudgetForm'

export default class NewBudget extends Component {

  static route = {
    navigationBar: {
      title: 'Nový rozpočet'
    },
  }

  render() {
    return (
      <BudgetForm />
    );
  }
}
