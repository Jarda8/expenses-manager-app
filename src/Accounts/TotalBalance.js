/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { getTotalBalanceAsync, ACCOUNTS_DS_EVENT_EMITTER } from '../DataSources/AccountsDS';

export default class TotalBalance extends Component {

  constructor(){
    super();
    this.state = {
      balance: 0
    }
  }

  componentWillMount(){
    this.loadData();
  }

  componentDidMount() {
    this.accountsChangedSubsrcibtion =
      ACCOUNTS_DS_EVENT_EMITTER.addListener('accountsChanged', this.loadData.bind(this));
  }

  componentWillUnmount() {
    this.accountsChangedSubsrcibtion.remove();
  }

  loadData() {
    getTotalBalanceAsync(result => this.setState({balance: result}));
  }

  render() {
    let color = 'green';
    if (this.state.balance < 0) {
      color = 'red';
    }
    return (
      <FormattedCurrency
        value={this.state.balance}
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
