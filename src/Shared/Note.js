/* @flow */
import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';


export default class Note extends Component {

  render() {
    return (
      <View style={styles.noteView}>
        <TextInput
          style={styles.noteInput}
          placeholder="Poznámka"
          onChangeText={this.props.handleOnChangeText} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  noteView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'aquamarine'
  },
  noteInput: {
    flex: 1
  }
});
