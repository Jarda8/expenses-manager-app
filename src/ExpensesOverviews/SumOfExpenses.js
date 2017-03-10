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
    this.loadData(this.props);
  }

  componentDidMount() {
    this.transactionsChangedSubsrcibtion =
      TRANSACTIONS_DS_EVENT_EMITTER.addListener('transactionsChanged', () => this.loadData(this.props));
  }

  componentWillUnmount() {
    this.transactionsChangedSubsrcibtion.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fromDate !== this.props.fromDate
      || nextProps.toDate !== this.props.toDate) {
      this.loadData(nextProps);
    }
  }

  loadData(props) {
    getSumOfExpensesAsync(props.fromDate, props.toDate, result =>
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
