import React, { Component } from 'react';

import BudgetForm from './BudgetForm'
import DeleteButton from '../Shared/DeleteButton'
import { deleteBudget } from '../Shared/DataSource';

export default class EditBudget extends Component {

  static route = {
    navigationBar: {
      title: 'Editovat rozpočet',
      renderRight: (route, props) =>
        <DeleteButton onPress={() =>
          {
            route.params.deleteBudget();
          }} />
    },
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.updateCurrentRouteParams({
        deleteBudget: this.deleteBudget.bind(this)
      })
    }, 200);
  }

  deleteBudget(budget) {
    deleteBudget(budget);
    this.props.navigator.pop();
  }

  render() {
    return (
      <BudgetForm budget={this.props.route.params.budget}/>
    );
  }
}
