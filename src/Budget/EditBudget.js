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
            deleteBudget(route.params.budget);
            route.params.navigateBack();
          }} />
    },
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.updateCurrentRouteParams({
        navigateBack: () => this.props.navigator.pop()
      })
    }, 1000);
  }

  render() {
    return (
      <BudgetForm budget={this.props.route.params.budget}/>
    );
  }
}
