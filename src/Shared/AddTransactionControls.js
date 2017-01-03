/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { Entypo } from '@exponent/vector-icons';
import NewExpense from '../NewTransaction/NewExpense';
import { Router } from '../../main';

export class AddTransactionControls extends Component {

  render() {
    return (
      <View style={styles.addTransactionControls}>
        <TouchableHighlight onPress={() => this.props.navigator.push(Router.getRoute('newExpense'))}>
          <Entypo name="squared-minus" size={64} color="red" />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => null}>
          <Entypo name="squared-plus" size={64} color="green" />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addTransactionControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
