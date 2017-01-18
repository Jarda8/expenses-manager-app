import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@exponent/vector-icons';
import { withNavigation } from '@exponent/ex-navigation';

import { Router } from '../../main';

@withNavigation
export default class TransferButton extends Component {

  navigateToTrasfer() {
    this.props.navigator.push(Router.getRoute('newTransfer'));
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.navigateToTrasfer.bind(this)}
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
