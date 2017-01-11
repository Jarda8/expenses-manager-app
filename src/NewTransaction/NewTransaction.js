/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker'

import Calculator from '../Shared/Calculator/Calculator';
import AccountSelector from '../Shared/AccountSelector';
import { accountsDS, saveTransaction } from '../Shared/DataSource';
import { Router } from '../../main';


export default class NewTransaction extends Component {

  constructor(props : any) {
    super(props);
    this.state = {
      displayedAmount: '0',
      account: accountsDS[0],
      note: '',
      finalAmount: 0,
      date: new Date()
    };
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleConfirmButtonPressed = this.handleConfirmButtonPressed.bind(this);
    this.saveNewTransaction = this.saveNewTransaction.bind(this);
    this.parseDate = this.parseDate.bind(this);
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({displayedAmount: toDisplay});
  }

  saveNewTransaction(category: string) {
    saveTransaction({
      accountName: this.state.account.name,
      accountNumber: this.state.account.number,
      category: category,
      amount: this.state.finalAmount * this.props.ifExpenseMinusOne,
      date: this.state.date,
      note: this.state.note
    })
    this.props.navigator.popToTop();
  }

  handleConfirmButtonPressed(amount : number) {
    // TODO blokovat záporný result -> upozornit uživatele a jinak nic
    this.setState({finalAmount: amount});
    this.props.navigator.push(
      Router.getRoute(
        'categories',
        {
          amount: amount,
          categories: this.props.categories,
          onCategorySelected: this.saveNewTransaction
        }));
  }

  parseDate(date: string): Date {
    let dateArray = date.split('.');
    let day = parseInt(dateArray[0]) + 1;
    let dayString = '' + day;
    if (day < 10) {
      dayString = '0' + dayString;
    }
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dayString);
  }

  render() {
    return (
      <View style={styles.newTransaction}>
        <View style={styles.accountView}>
          <AccountSelector
            selectedAccount={this.state.account}
            onAccountChange={(acc) => this.setState({account: acc})} />
          <DatePicker
            style={styles.datePicker}
            date={this.state.date}
            mode="date"
            placeholder="zvolte datum"
            format="DD.MM.YYYY"
            confirmBtnText="Potvrdit"
            cancelBtnText="Zrušit"
            onDateChange={(date) => {
              this.setState({date: this.parseDate(date)})
              // console.log(date);
            }}
          />
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
            initialNumber={0}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
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
