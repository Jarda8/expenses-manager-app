/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getSumOfIncomes } from '../Shared/DataSource';

export default class SumOfIncomes extends Component {

  getIncomesTotal() {
    return getSumOfIncomes(this.props.fromDate, this.props.toDate).amount;
  }

  render() {
    return (
      <FormattedCurrency
        value={this.getIncomesTotal()}
        style={styles.expenses} />
      );
    }
  }

const styles = StyleSheet.create({
  expenses: {
    color: 'green',
    textAlign: 'center',
    fontSize: 15
  }
})
