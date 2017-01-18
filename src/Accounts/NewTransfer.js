/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@exponent/vector-icons';

import Calculator from '../Shared/Calculator/Calculator';
import AccountSelector from '../Shared/AccountSelector';
import { Transfer } from '../Shared/Categories';
import { getAccounts, saveTransfer } from '../Shared/DataSource';
import Note from '../Shared/Note';


export default class NewTransfer extends Component {

    static route = {
      navigationBar: {
        title: 'Převod'
      },
    }

  constructor(props : any) {
    super(props);
    this.state = {
      displayedAmount: '0',
      fromAccount: getAccounts()[0],
      toAccount: getAccounts()[1],
      note: '',
      finalAmount: 0,
      date: new Date()
    };
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.saveNewTransfer = this.saveNewTransfer.bind(this);
    this.parseDate = this.parseDate.bind(this);
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({displayedAmount: toDisplay});
  }

  saveNewTransfer(amount: number) {
    saveTransfer({
      fromAccountName: this.state.fromAccount.name,
      fromAccountNumber: this.state.fromAccount.number,
      toAccountName: this.state.toAccount.name,
      toAccountNumber: this.state.toAccount.number,
      amount: amount,
      date: this.state.date,
      note: this.state.note
    });
    this.props.navigator.popToTop();
  }

  parseDate(date: string): Date {
    let dateArray = date.split('.');
    let day = parseInt(dateArray[0]);
    let month = parseInt(dateArray[1]) - 1;
    let year = parseInt(dateArray[2]);

    return new Date(year, month, day, 0, 0, 0, 0);
  }

  render() {
    return (
      <View style={styles.newTransfer}>
        <View style={styles.accountsView}>
          <AccountSelector
            selectedAccount={this.state.fromAccount}
            style={styles.AccountSelector}
            onAccountChange={(acc) => this.setState({fromAccount: acc})} />
          <View style={styles.arrowView}>
            <Ionicons name='ios-arrow-forward' size={32} color='black' />
          </View>
          <AccountSelector
            selectedAccount={this.state.toAccount}
            style={styles.AccountSelector}
            onAccountChange={(acc) => this.setState({toAccount: acc})} />
        </View>
        <View style={styles.dateAmountView}>
          <DatePicker
            date={this.state.date}
            mode="date"
            placeholder="zvolte datum"
            format="DD.MM.YYYY"
            confirmBtnText="Potvrdit"
            cancelBtnText="Zrušit"
            onDateChange={(date) => {
              this.setState({date: this.parseDate(date)})
            }}
          />
          <View style={styles.amountDisplay}>
            <Text style={styles.displayedAmount}>{this.state.displayedAmount}</Text>
            {/* TODO lokalizovat měnu */}
            <Text style={styles.currency}>CZK</Text>
          </View>
        </View>
        <Note />
        <View style={styles.calculatorView}>
          <Calculator
            initialNumber={0}
            onDisplayChange={this.handleDisplayChange}
            onConfirmButtonPressed={this.saveNewTransfer}
            confirmButtonText='Uložit'  />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newTransfer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    margin: 10
  },
  accountsView: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dateAmountView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amountDisplay: {
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
  calculatorView: {
    flex: 5
  },
  AccountSelector: {
    flex: 1
  },
  arrowView: {
    flex: 0.2,
    alignItems: 'center'
  }
});
