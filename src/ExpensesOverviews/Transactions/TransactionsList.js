/* @flow */
import React, { Component } from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';

import TransactionsListItem from './TransactionsListItem';
import { getTransactionsAsync, TRANSACTIONS_DS_EVENT_EMITTER } from '../../DataSources/TransactionsDS';
import { All } from '../../Shared/Categories';
import { Router } from '../../../main';

import type { Transaction } from '../../Shared/DataSource';

@withNavigation
export default class TransactionsList extends Component {

  constructor(props : any) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    this.data = [];
    this.editTransaction = this.editTransaction.bind(this);
    this.renderTransactionItem = this.renderTransactionItem.bind(this);
  }

  componentWillMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fromDate !== this.props.fromDate
      || nextProps.toDate !== this.props.toDate
      || nextProps.category !== this.props.category) {
      this.loadData(nextProps);
    }
  }

  componentDidMount() {
    this.transactionsChangedSubsrcibtion =
      TRANSACTIONS_DS_EVENT_EMITTER.addListener('transactionsChanged',
        () => this.loadData(this.props));
  }

  componentWillUnmount() {
    this.transactionsChangedSubsrcibtion.remove();
  }

  loadData(props) {
    getTransactionsAsync(props.category, props.fromDate, props.toDate, result => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(result)})
    });
  }

  editTransaction(transaction: Transaction) {
    this.props.navigator.push(Router.getRoute('editTransaction', {transaction: transaction}));
  }

  renderTransactionItem(transaction : Transaction) {
    return (
      <TransactionsListItem transaction={transaction} onPress={this.editTransaction} />
    );
  }

  render() {
    return (
      <View style={this.props.style}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderTransactionItem}
        />
      </View>
    );
  }
}
