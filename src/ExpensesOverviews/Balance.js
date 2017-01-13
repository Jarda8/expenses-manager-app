/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getSumOfTransactions } from '../Shared/DataSource';
import { All } from '../Shared/Categories'

export default class Balance extends Component {

  getBalance() {
    return getSumOfTransactions(All, this.props.fromDate, this.props.toDate).amount;
  }

  render() {
    let balance = this.getBalance();
    let color = 'green';
    if (balance < 0) {
      color = 'red';
    }
    return (
      <FormattedCurrency
        value={balance}
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
