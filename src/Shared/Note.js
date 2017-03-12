/* @flow */
import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';


export default class Note extends Component {

  render() {
    return (
      <View style={styles.noteView}>
        <TextInput
          onFocus={this.props.onFocus}
          style={[styles.noteInput, this.props.style]}
          placeholder="Poznámka"
          onChangeText={this.props.onChangeText} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  noteView: {
    flex: 1,
    flexDirection: 'row'
  },
  noteInput: {
    flex: 1
  }
});
