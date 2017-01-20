/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';

import FullWidthButton from '../Shared/FullWidthButton'
import { Router } from '../../main'

@withNavigation
export default class BudgetView extends Component {

  addBudget() {
    this.props.navigator.push(Router.getRoute('newBudget'));
  }

  render() {
    return (
      <View style={styles.budgetView}>
        <View style={styles.budgets}>
          {this.props.children}
        </View>
        <FullWidthButton text='Přidat rozpočet' onPress={this.addBudget.bind(this)} flexSize={1} />
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
