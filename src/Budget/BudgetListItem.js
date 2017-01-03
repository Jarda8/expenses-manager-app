/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';


export default class BudgetListItem extends Component {

  editBudget() {
    console.log('budget: ' + this.props.budgetItem.category + ' ' + this.props.budgetItem.budget);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.editBudget.bind(this)} underlayColor="steelblue">
        <View style={styles.budgetItem}>
          <Text style={styles.category}>{this.props.budgetItem.category}</Text>
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
