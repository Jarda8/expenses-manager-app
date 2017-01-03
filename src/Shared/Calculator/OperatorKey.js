/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';


export default class OperatorKey extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onKeyPress}
        underlayColor= 'steelblue'
        style={styles.keyTouchable}>
        <Text style={styles.symbol}>{this.props.symbol}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  symbol: {
    fontSize: 30
  },
  keyTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    margin: 1
  }
});
