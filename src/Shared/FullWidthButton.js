/* @flow */
import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';

export default class FullWidthButton extends Component {
  render() {
    buttonStyle = [styles.button, {flex: this.props.flexSize}];
    return (
        <TouchableHighlight style={buttonStyle} onPress={this.props.onPress} underlayColor= 'steelblue'>
          <Text style={styles.text}>{this.props.text}</Text>
        </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    margin: 10
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20
  }
});
