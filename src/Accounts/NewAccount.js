import React, { Component } from 'react';

import AccountForm from './AccountForm'

export default class NewAccount extends Component {

  static route = {
    navigationBar: {
      title: 'Nový účet'
    },
  }

  render() {
    return (
      <AccountForm />
    );
  }
}
