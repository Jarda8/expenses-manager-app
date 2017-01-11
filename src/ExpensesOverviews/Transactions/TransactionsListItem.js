/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';

import { ExpensesCategories, IncomeCategories } from '../../Shared/Categories'


export default class TransactionsListItem extends Component {

  renderAmount(amount : number) {
  let amountStyle = [styles.amount];
    if (amount < 0) {
      amountStyle.push({ color: 'red'});
    } else {
      amountStyle.push({ color: 'green'});
    }
    return (
      <FormattedCurrency
        value={amount}
        style={amountStyle} />
    );
  }

  handleOnPress() {
    this.props.onPress(this.props.transaction);
  }

  renderCategory(transaction: Object) {
    let category: string = '';
    if (transaction.amount < 0) {
      category = ExpensesCategories[transaction.category];
    } else {
      category = IncomeCategories[transaction.category];
    }
    return category;
  }

  render() {
    return (
      <TouchableHighlight onPress={this.handleOnPress.bind(this)} underlayColor="steelblue">
        <View style={styles.transaction}>
          <View style={styles.categoryAndAmount}>
            <Text style={styles.category}>{this.renderCategory(this.props.transaction)}</Text>
            {this.renderAmount(this.props.transaction.amount)}
          </View>
          <Text style={styles.dateAndNote}>{this.props.transaction.date.getDate()}.{this.props.transaction.date.getMonth() + 1}.{this.props.transaction.date.getFullYear()} {this.props.transaction.note}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  transaction: {
    height: 50,
    marginLeft: 10,
    marginRight: 10
  },
  categoryAndAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  category: {
    fontSize: 15
  },
  amount: {
    fontSize: 15
  },
  dateAndNote: {
    fontSize: 10
  }
});
