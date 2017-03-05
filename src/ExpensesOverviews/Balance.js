/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getSumOfTransactionsAsync, TRANSACTIONS_DS_EVENT_EMITTER } from '../DataSources/TransactionsDS';
import { All } from '../Shared/Categories'

export default class Balance extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      balance: 0
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
    getSumOfTransactionsAsync(All, this.props.fromDate, this.props.toDate, result =>
      this.setState({balance: result.amount}));
  }

  render() {
    let color = 'green';
    if (this.state.balance < 0) {
      color = 'red';
    }
    return (
      <FormattedCurrency
        value={this.state.balance}
        style={[styles.balance, {color: color}]} />
      );
    }
  }

const styles = StyleSheet.create({
  balance: {
    textAlign: 'center',
    fontSize: 18
  }
})
