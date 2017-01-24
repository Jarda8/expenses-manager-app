import React, { Component } from 'react';

import AccountForm from './AccountForm'
import DeleteButton from '../Shared/DeleteButton'
import { deleteAccountAsync } from '../DataSources/AccountsDS';

export default class EditAccount extends Component {

  static route = {
    navigationBar: {
      title: 'Úprava účtu',
      renderRight: (route, props) =>
        <DeleteButton onPress={() =>
          {
            deleteAccountAsync(route.params.account);
            route.params.navigateBack();
          }} />
    },
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.updateCurrentRouteParams({
        navigateBack: () => this.props.navigator.pop()
      })
    }, 200);
  }

  render() {
    return (
      <AccountForm account={this.props.route.params.account}/>
    );
  }
}
