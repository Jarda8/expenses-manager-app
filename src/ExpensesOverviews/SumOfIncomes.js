/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getSumOfIncomesAsync, TRANSACTIONS_DS_EVENT_EMITTER } from '../DataSources/TransactionsDS';

export default class SumOfIncomes extends Component {

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
    getSumOfIncomesAsync(props.fromDate, props.toDate, result =>
      this.setState({sum: result.amount}));
  }

  render() {
    return (
      <FormattedCurrency
        value={this.state.sum}
        style={styles.incomes} />
      );
    }
  }

const styles = StyleSheet.create({
  incomes: {
    color: 'green',
    textAlign: 'center',
    fontSize: 15
  }
})
