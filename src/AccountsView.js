/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';

import Balance from './Balance';

export default class AccountsView extends Component {

  constructor() {
    super();
    this.state = {
      balance: 21654
    };
  }

  addAccount() {
    console.log('addAccount tapped');
  }

  render() {
    return (
      <View style={styles.accountsView}>
        <View style={styles.balance}>
          <Balance balance={this.state.balance} />
        </View>
        <View style={styles.accounts}>
          {this.props.children}
        </View>
        <TouchableHighlight style={styles.addAccount} onPress={this.addAccount.bind(this)} underlayColor= 'steelblue'>
          <Text style={styles.addAccountText}>Přidat účet</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accountsView: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  balance: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'cyan'
  },
  accounts: {
    flex: 7
  },
  addAccount: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    margin: 10
  },
  addAccountText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20
  }
});
