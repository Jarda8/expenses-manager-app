/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';

import Calculator from '../Shared/Calculator/Calculator';
import AccountSelector from '../Shared/AccountSelector';
import { accountsDS } from '../Shared/DataSource';
import { Router } from '../../main';


export default class NewTransaction extends Component {

  constructor(props : any) {
    super(props);
    this.state = {
      displayedAmount: '0',
      account: accountsDS[0].name,
      note: ''
    };
    // Budou dvě nadřazené komponenty - NewExpense, NewIncome. Ty budou renderovat pouze tuto komponentu s rozdílnými props.
    // V propsech dostanu seznam katgorií, a další věci závislé na tom, jestli je to příjem nebo výdej.
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleConfirmButtonPressed = this.handleConfirmButtonPressed.bind(this);
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({displayedAmount: toDisplay});
  }

  handleConfirmButtonPressed(amount : number) {
    // TODO blokovat záporný result -> upozornit uživatele a jinak nic
    // console.log(amount);
    this.props.navigator.push(
      Router.getRoute(
        'categories',
        {
          amount: amount,
          categories: this.props.categories,
          note: this.state.note,
          ifExpenseMinusOne: this.props.ifExpenseMinusOne
        }));
  }

  render() {
    return (
      <View style={styles.newTransaction}>
        <View style={styles.accountView}>
          <AccountSelector
            selectedAccount={this.state.account}
            onAccountChange={(acc) => this.setState({account: acc})} />
        </View>
        <View style={styles.amountDisplay}>
          <Text style={styles.displayedAmount}>{this.state.displayedAmount}</Text>
          {/* TODO lokalizovat měnu */}
          <Text style={styles.currency}>CZK</Text>
        </View>
        <View style={styles.noteView}>
          <Text style={styles.noteLabel}>Poznámka: </Text>
          <TextInput
            style={styles.noteInput}
            onChangeText={(text) => this.setState({note: text})} />
        </View>
        <View style={styles.calculatorView}>
          <Calculator
            onDisplayChange={this.handleDisplayChange}
            onConfirmButtonPressed={this.handleConfirmButtonPressed}
            confirmButtonText='Vybrat kategorii'  />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newTransaction: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    margin: 10
  },
  accountView: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  amountDisplay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  displayedAmount: {
    fontSize: 30
  },
  currency: {
    fontSize: 30,
    marginLeft: 10
  },
  noteView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'aquamarine'
  },
  noteInput: {
    flex: 4
  },
  noteLabel: {
    flex: 1
  },
  calculatorView: {
    flex: 5
  }
});
