/* @flow */
import React, { Component } from 'react';
import { ListView, StyleSheet, Text } from 'react-native';

import TransactionsListItem from './TransactionsListItem';
import { getTransactions } from '../../Shared/DataSource'
import { All } from '../../Shared/Categories'

export default class TransactionsList extends Component {

  constructor(props : any) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  renderTransactionItem(transaction : any) {
    return (
      <TransactionsListItem transaction={transaction} />
    );
  }

  getTransactionsDS() {
    let transactionsArray = getTransactions(this.props.category, this.props.date);
    return this.state.dataSource.cloneWithRows(transactionsArray);
  }

  render() {
    return (
        <ListView
          dataSource={this.getTransactionsDS()}
          renderRow={this.renderTransactionItem}
        />
    );
  }
}
