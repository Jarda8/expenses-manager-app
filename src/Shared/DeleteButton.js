import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@exponent/vector-icons';

export default class DeleteButton extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        // onPress={() => console.log('baf')}
        underlayColor= 'steelblue'
        style={styles.deleteButton}>
        <FontAwesome name='trash-o' size={32} color='black' />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    margin: 10
  }
});
