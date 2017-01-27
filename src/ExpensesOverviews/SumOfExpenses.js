/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getSumOfExpensesAsync, TRANSACTIONS_DS_EVENT_EMITTER } from '../DataSources/TransactionsDS';

export default class SumOfExpenses extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      sum: 0
    }
  }

  componentWillMount(){
    this.loadData();
  }

  componentDidMount() {
    this.transactionsChangedSubsrcibtion =
      TRANSACTIONS_DS_EVENT_EMITTER.addListener('transactionsChanged', this.loadData.bind(this));
  }

  componentWillUnmount() {
    this.transactionsChangedSubsrcibtion.remove();
  }

  loadData() {
    getSumOfExpensesAsync(this.props.fromDate, this.props.toDate, result =>
      this.setState({sum: result.amount}));
  }

  render() {
    return (
      <FormattedCurrency
        value={this.state.sum}
        style={styles.expenses} />
      );
    }
  }

const styles = StyleSheet.create({
  expenses: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15
  }
})
