/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';


export default class NumberKey extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={() => this.props.onKeyPress(this.props.number)}
        underlayColor= 'steelblue'
        style={styles.keyTouchable}>
        <Text style={styles.number}>{this.props.number}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  number: {
    fontSize: 30
  },
  keyTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    margin: 1,
    backgroundColor: 'steelblue'
  }
});
