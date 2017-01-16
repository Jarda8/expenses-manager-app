/* @flow */
import React, { Component } from 'react';
import { ListView, StyleSheet, Text } from 'react-native';

import ExpensesView from '../ExpensesView';
import CategorySelector from '../../Shared/CategorySelector';
import TransactionsList from './TransactionsList';

export default class TransactionsListView extends Component {

  static route = {
    navigationBar: {
      title: 'Transakce'
    },
  }

  render() {
    return (
      <ExpensesView navigator={this.props.navigator}>
        <CategorySelector />
        <TransactionsList />
      </ExpensesView>
    );
  }
}
