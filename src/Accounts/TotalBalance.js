/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getTotalBalance } from '../Shared/DataSource';

export default class TotalBalance extends Component {

  getCurrentTotalBalance() {
    return getTotalBalance();
  }

  render() {
    let balance = this.getCurrentTotalBalance();
    let color = 'green';
    if (balance < 0) {
      color = 'red';
    }
    return (
      <FormattedCurrency
        value={balance}
        style={[styles.expenses, {color: color}]} />
      );
    }
  }

const styles = StyleSheet.create({
  expenses: {
    textAlign: 'center',
    fontSize: 18
  }
})
