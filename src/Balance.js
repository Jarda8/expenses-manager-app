/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

export default class Balance extends Component {

  render() {
    return (
      <FormattedCurrency
        value={this.props.balance}
        style={styles.balance} />
      );
    }
  }

const styles = StyleSheet.create({
  balance: {
    color: 'green',
    textAlign: 'center',
    fontSize: 16
  }
})
