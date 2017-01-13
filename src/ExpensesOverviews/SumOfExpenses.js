/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getSumOfExpenses } from '../Shared/DataSource';

export default class SumOfExpenses extends Component {

  getExpensesTotal() {
    return getSumOfExpenses(this.props.fromDate, this.props.toDate).amount;
  }

  render() {
    return (
      <FormattedCurrency
        value={this.getExpensesTotal()}
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
