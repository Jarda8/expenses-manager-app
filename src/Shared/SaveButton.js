import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@exponent/vector-icons';

export default class SaveButton extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor= 'steelblue'
        style={styles.saveButton}>
        <FontAwesome name='save' size={32} color='black' />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  saveButton: {
    margin: 10
  }
});
