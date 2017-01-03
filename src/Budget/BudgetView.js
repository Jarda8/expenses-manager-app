/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import FullWidthButton from '../Shared/FullWidthButton'

export default class BudgetView extends Component {

  addBudget() {
    console.log('addBudget tapped');
  }

  render() {
    return (
      <View style={styles.budgetView}>
        <View style={styles.budgets}>
          {this.props.children}
        </View>
        <FullWidthButton text='Přidat limit' onPress={this.addBudget.bind(this)} flexSize={1} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  budgetView: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  budgets: {
    flex: 7
  }
});
