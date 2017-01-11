/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';
import { withNavigation } from '@exponent/ex-navigation';

import { ExpensesCategories } from '../Shared/Categories';
import { Router } from '../../main'

@withNavigation
export default class BudgetListItem extends Component {

  editBudget() {
    this.props.navigator.push(Router.getRoute('editBudget', {budget: this.props.budgetItem}));
  }

  render() {
    return (
      <TouchableHighlight onPress={this.editBudget.bind(this)} underlayColor="steelblue">
        <View style={styles.budgetItem}>
          <Text style={styles.category}>{ExpensesCategories[this.props.budgetItem.category]}</Text>
          <FormattedCurrency
            value={this.props.budgetItem.budget}
            style={styles.budget} />
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  budgetItem: {
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameAndBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  category: {
    fontSize: 17
  },
  budget: {
    fontSize: 17
  }
});
