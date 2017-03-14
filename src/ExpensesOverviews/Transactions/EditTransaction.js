/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@exponent/vector-icons';
import DatePicker from 'react-native-datepicker'

import Calculator from '../../Shared/Calculator/Calculator';
import AccountSelector from '../../Shared/AccountSelector';
import { getAccountAsync } from '../../DataSources/AccountsDS';
import { deleteTransactionAsync } from '../../DataSources/TransactionsDS';
import { Router } from '../../../main';
import { ExpensesCategories, IncomeCategories } from '../../Shared/Categories';
// import SaveButton from '../../Shared/SaveButton';
import DeleteButton from '../../Shared/DeleteButton';
import ChangeToTransferButton from './ChangeToTransferButton';
import TransactionModificator from './TransactionModificator';
import Note from '../../Shared/Note';
import Categorization from '../../DataImport/Categorization';


export default class EditTransaction extends Component {

  static route = {
    navigationBar: {
      title: 'Úpravy transakce',
      renderRight: (route) =>
        <View style={styles.navbarMenu}>
          {/* <SaveButton onPress={route.params.update} /> */}
          <DeleteButton onPress={route.params.delete} />
          <ChangeToTransferButton onPress={route.params.changeToTransfer} />
        </View>
    },
  }

  constructor(props : any) {
    super(props);
    let transaction = props.route.params.transaction;
    let ifExpenseMinusOne = 1;
    if (transaction.amount < 0) {
      ifExpenseMinusOne = -1;
    }
    this.state = {
      displayedAmount: '' + (transaction.amount * ifExpenseMinusOne),
      account: '',
      note: transaction.note,
      date: transaction.date,
      finalAmount: transaction.amount * ifExpenseMinusOne,
      ifExpenseMinusOne: ifExpenseMinusOne
    };
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleConfirmButtonPressed = this.handleConfirmButtonPressed.bind(this);
    this.updateThisTransactionWithCategory = this.updateThisTransactionWithCategory.bind(this);
    // this.updateThisTransaction = this.updateThisTransaction.bind(this);
    this.deleteThisTransaction = this.deleteThisTransaction.bind(this);
    this.changeToTransfer = this.changeToTransfer.bind(this);
    this.parseDate = this.parseDate.bind(this);
  }

  componentWillMount() {
    getAccountAsync(
      this.props.route.params.transaction.accountId,
      account => this.setState({account: account})
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.updateCurrentRouteParams({
        // update: this.updateThisTransaction,
        delete: this.deleteThisTransaction,
        changeToTransfer: this.changeToTransfer
      })
    }, 1000);
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({displayedAmount: toDisplay});
  }

  // updateThisTransaction() {
  //   this.updateThisTransactionWithCategory(this.props.route.params.transaction.category);
  // Vyřešit problém s updatováním finalAmount. Správnou hodnotu zná, resp. musí spočítat, Calculator.
  // }

  deleteThisTransaction() {
    deleteTransactionAsync(this.props.route.params.transaction);
    this.props.navigator.popToTop();
  }

  changeToTransfer() {
    this.props.navigator.push(
      Router.getRoute(
        'newTransfer',
        {
          transaction: this.props.route.params.transaction
        }));
  }

  updateThisTransactionWithCategory(category: string) {
    let oldTransaction = this.props.route.params.transaction;
      TransactionModificator.updateTransaction(
        oldTransaction,
        {
        accountId: this.state.account._id,
        category: category,
        amount: this.state.finalAmount * this.state.ifExpenseMinusOne,
        date: this.state.date,
        note: this.state.note
      });
      if (this.state.account.connected && oldTransaction.category !== category) {
        Categorization.addNewCategorization({category: category, accountParty: oldTransaction.accountParty});
      }
      this.props.navigator.popToTop();
  }

  handleConfirmButtonPressed(amount : number) {
    // TODO blokovat záporný a nulový amount -> upozornit uživatele a jinak nic
    let categories = ExpensesCategories;
    if (this.props.route.params.transaction.amount >= 0) {
      categories = IncomeCategories;
    }

    this.setState({finalAmount: amount});
    this.props.navigator.push(
      Router.getRoute(
        'categories',
        {
          amount: amount,
          categories: categories,
          onCategorySelected: this.updateThisTransactionWithCategory
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
            selectedAccount={this.state.account}
            style={styles.AccountSelector}
            onAccountChange={(acc) => this.setState({account: acc})} />
          <DatePicker
            style={styles.datePicker}
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
        <Note handleOnChangeText={(text) => this.setState({note: text})}/>
        <View style={styles.calculatorView}>
          <Calculator
            initialNumber={this.state.finalAmount}
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
  navbarMenu: {
    flexDirection: 'row'
  },
  AccountSelector: {
    width: 180
  }
});
