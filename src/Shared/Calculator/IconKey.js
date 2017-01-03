/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';


export default class IconKey extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onKeyPress}
        underlayColor= 'steelblue'
        style={styles.keyTouchable}>
        {this.props.children}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  keyTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    margin: 1
  }
});
