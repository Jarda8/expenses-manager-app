/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Balance from './Balance'

export default class AccountsView extends Component {

    static route = {
      navigationBar: {
        title: 'Accounts'
      },
    }

  constructor(props : any) {
    super(props);
    this.state = {
      balance: 21654
    };
  }

  render() {
    return (
      <View style={styles.accountsView}>
        <View style={styles.balance}>
          <Balance balance={this.state.balance} />
        </View>
        <View style={styles.accounts}>
          
        </View>
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
  }
});
