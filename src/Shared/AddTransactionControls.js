/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Entypo } from '@exponent/vector-icons';
import { Router } from '../../main';

import DataImporter from '../DataImport/DataImporter';

export class AddTransactionControls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      syncing: false,
    };
  }

  async fetchTransactions() {
    this.setState({syncing: true});
    DataImporter.fetchTransactions(() => {this.setState({syncing: false})});
  }

  render() {
    return (
      <View style={styles.addTransactionControls}>
        <TouchableHighlight onPress={() => this.props.navigator.push(Router.getRoute('newExpense'))}>
          <Entypo name="squared-minus" size={64} color="#145672" />
        </TouchableHighlight>
        {(() => {if (this.state.syncing) {
          return (<ActivityIndicator size="large" />)
        } else {
          return (<TouchableHighlight style={styles.syncButton}  onPress={this.fetchTransactions.bind(this)}>
            <Entypo name="cycle" size={52} color="steelblue" />
          </TouchableHighlight>)
        }})()}

        <TouchableHighlight onPress={() => this.props.navigator.push(Router.getRoute('newIncome'))}>
          <Entypo name="squared-plus" size={64} color="#145672" />
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
    justifyContent: 'space-around'
  },
  syncButton: {
    backgroundColor: '#145672',
    borderRadius: 6
  }
});
