/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';

import FullWidthButton from '../Shared/FullWidthButton'
import { Router } from '../../main';
import TotalBalance from './TotalBalance';

@withNavigation
export default class AccountsView extends Component {

  addAccount() {
    this.props.navigator.push(Router.getRoute('newAccount'));
  }

  render() {
    return (
      <View style={styles.accountsView}>
        <View style={styles.balance}>
          <TotalBalance/>
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
    justifyContent: 'center'
  },
  accounts: {
    flex: 7
  }
});
