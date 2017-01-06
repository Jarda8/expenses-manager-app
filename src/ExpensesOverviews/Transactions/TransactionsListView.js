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

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.renderTransactionItem = this.renderTransactionItem.bind(this);
  }

  renderTransactionItem(transaction : any) {
    return (
      <TransactionsListItem transaction={transaction} />
    );
  }

  render() {
    console.log('TransctionListView is rendering');
    return (
      <ExpensesView navigator={this.props.navigator}>
        <CategorySelector />
        <TransactionsList />
      </ExpensesView>
    );
  }
}
