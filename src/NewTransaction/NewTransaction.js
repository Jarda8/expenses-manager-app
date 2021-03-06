/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';

import Calculator from '../Shared/Calculator/Calculator';
import AccountSelector from '../Shared/AccountSelector';
import { ExpensesCategories } from '../Shared/Categories';
import { getAccountsAsync } from '../DataSources/AccountsDS';
import TransactionModificator from '../ExpensesOverviews/Transactions/TransactionModificator';
import Note from '../Shared/Note';
import { Router } from '../../main';


export default class NewTransaction extends Component {

  constructor(props : any) {
    super(props);
    this.state = {
      displayedAmount: '0',
      account: null,
      note: '',
      finalAmount: 0,
      date: new Date()
    };
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleConfirmButtonPressed = this.handleConfirmButtonPressed.bind(this);
    this.saveNewTransaction = this.saveNewTransaction.bind(this);
    this.parseDate = this.parseDate.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  componentWillMount(){
    getAccountsAsync(result => {
      if (result.length === 0) {
        Alert.alert( 'Nelze přidat transakci!', 'Nemáte přidaný žádný účet. Nejprve je třeba přidat účet v sekci "Účty".');
        this.props.navigator.popToTop();
      } else {
        this.setState({account: result[0]});
      }
    });
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({displayedAmount: toDisplay});
  }

  handleNoteChange(text) {
    this.setState({note: text});
  }

  saveNewTransaction(category: string) {
    TransactionModificator.saveTransaction({
      accountId: this.state.account._id,
      category: category,
      amount: this.state.finalAmount * this.props.ifExpenseMinusOne,
      currency: this.state.account.currency,
      date: this.state.date,
      note: this.state.note
    });
    this.props.navigator.popToTop();
  }

  handleConfirmButtonPressed(amount: number) {
    if (amount <= 0) {
      Alert.alert('Částka transakce musí být větší než nula.');
    } else {
      this.setState({finalAmount: amount});
      this.props.navigator.push(
        Router.getRoute(
          'categories',
          {
            amount: amount,
            currency: this.state.account.currency,
            categories: this.props.categories,
            onCategorySelected: this.saveNewTransaction
          }));
    }
  }

  parseDate(date: string): Date {
    let dateArray = date.split('.');
    let day = parseInt(dateArray[0]);
    let month = parseInt(dateArray[1]) - 1;
    let year = parseInt(dateArray[2]);
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  renderCurrency() {
    if (this.state.account) {
      return this.state.account.currency;
    }
  }

  render() {
    return (
      <View style={styles.newTransaction}>
        <View style={styles.accountView}>
          <AccountSelector
            style={styles.AccountSelector}
            selectedAccount={this.state.account}
            onAccountChange={(acc) => this.setState({account: acc})} />
          <DatePicker
            date={this.state.date}
            mode="date"
            placeholder="zvolte datum"
            format="DD.MM.YYYY"
            confirmBtnText="Potvrdit"
            cancelBtnText="Zrušit"
            onDateChange={(date) => {this.setState({date: this.parseDate(date)})}}
          />
        </View>
        <View style={styles.amountDisplay}>
          <Text style={styles.displayedAmount}>{this.state.displayedAmount}</Text>
          <Text style={styles.currency}>{this.renderCurrency()}</Text>
        </View>
        <Note
          onChangeText={this.handleNoteChange}
        />
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
  calculatorView: {
    flex: 5
  },
  AccountSelector: {
    width: 180
  }
});
