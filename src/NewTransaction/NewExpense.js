/* @flow */
import React, { Component } from 'react';

import NewTransaction from './NewTransaction';


export default class NewExpense extends Component {

  static route = {
    navigationBar: {
      title: 'Nový výdaj'
    },
  }

  render() {
    return (
      <NewTransaction/>
    );
  }
}
