/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Balance from '../Shared/Balance';
import FullWidthButton from '../Shared/FullWidthButton'
import { Router } from '../../main';
import { withNavigation } from '@exponent/ex-navigation';

@withNavigation
export default class AccountsView extends Component {

  constructor() {
    super();
    this.state = {
      balance: 21654
    };
  }

  addAccount() {
    this.props.navigator.push(Router.getRoute('newAccount'));
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
        <FullWidthButton text='Přidat účet' onPress={this.addAccount.bind(this)} flexSize={1} />
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
