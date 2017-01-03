/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';


export default class AccountsListItem extends Component {

  renderBalance(balance : number) {
  let balanceStyle = [styles.balance];
    if (balance < 0) {
      balanceStyle.push({ color: 'red'});
    } else {
      balanceStyle.push({ color: 'green'});
    }
    return (
      <FormattedCurrency
        value={balance}
        style={balanceStyle} />
    );
  }

  editAccount() {
    console.log(this.props.account.name);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.editAccount.bind(this)} underlayColor="steelblue">
        <View style={styles.account}>
          <View style={styles.nameAndBalance}>
            <Text style={styles.name}>{this.props.account.name}</Text>
            {this.renderBalance(this.props.account.balance)}
          </View>
          <Text style={styles.type}>{this.props.account.type}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  account: {
    height: 70,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center'
  },
  nameAndBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 17
  },
  balance: {
    fontSize: 17
  },
  type: {
    fontSize: 10
  }
});
