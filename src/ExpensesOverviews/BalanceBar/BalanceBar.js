/* @flow */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import Balance from './Balance';
import SumOfExpenses from './SumOfExpenses'
import SumOfIncomes from './SumOfIncomes'

export default class BalanceBar extends Component {

  render() {
    return (
      <View style={[styles.balance, this.props.style]}>
        <SumOfIncomes fromDate={this.props.fromDate} toDate={this.props.toDate} />
        <Balance fromDate={this.props.fromDate} toDate={this.props.toDate} />
        <SumOfExpenses fromDate={this.props.fromDate} toDate={this.props.toDate} />
      </View>
      );
    }
  }

const styles = StyleSheet.create({
  balance: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
})
