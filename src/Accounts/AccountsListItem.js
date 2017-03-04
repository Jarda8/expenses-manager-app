/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';
import { withNavigation } from '@exponent/ex-navigation'

import { accountTypes } from '../DataSources/AccountsDS';
import { Router } from '../../main';

@withNavigation
export default class AccountsListItem extends Component {

  renderBalance(balance : number, currency: string) {
  let balanceStyle = [styles.balance];
    if (balance < 0) {
      balanceStyle.push({ color: 'red'});
    } else {
      balanceStyle.push({ color: 'green'});
    }
    return (
      <FormattedCurrency
        value={balance}
        currency={currency}
        style={balanceStyle} />
    );
  }

  editAccount() {
    this.props.navigator.push(Router.getRoute('editAccount', {account: this.props.account}));
  }

  render() {
    return (
      <TouchableHighlight onPress={this.editAccount.bind(this)} underlayColor="steelblue">
        <View style={styles.account}>
          <View style={styles.nameAndBalance}>
            <Text style={styles.name}>{this.props.account.name}</Text>
            {this.renderBalance(this.props.account.balance, this.props.account.currency)}
          </View>
          <Text style={styles.type}>{accountTypes.get(this.props.account.type)}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  account: {
    height: 70,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center'
  },
  nameAndBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 17
  },
  balance: {
    fontSize: 17
  },
  type: {
    fontSize: 10
  }
});
