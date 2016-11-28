/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';


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

  editTransaction() {
    console.log(this.props.transaction.category + this.props.transaction.amount);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.editTransaction.bind(this)} underlayColor="steelblue">
        <View style={styles.transaction}>
          <View style={styles.categoryAndAmount}>
            <Text style={styles.category}>{this.props.transaction.category}</Text>
            {this.renderAmount(this.props.transaction.amount)}
          </View>
          <Text style={styles.dateAndNote}>{this.props.transaction.date} {this.props.transaction.note}</Text>
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
