import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@exponent/vector-icons';

export default class ChangeToTransferButton extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor= 'steelblue'
        style={styles.transferButton}>
        <FontAwesome name='exchange' size={32} color='black' />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  transferButton: {
    margin: 10
  }
});
