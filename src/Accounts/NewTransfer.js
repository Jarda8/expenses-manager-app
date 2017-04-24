/* @flow */
import React, { Component } from 'react';
import ReactNative, { Keyboard, ScrollView, View, StyleSheet, Text, TextInput, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@exponent/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import type { Account } from '../DataSources/AccountsDS'
import Calculator from '../Shared/Calculator/Calculator';
import AccountSelector from '../Shared/AccountSelector';
import { Transfer } from '../Shared/Categories';
import { saveTransferAsync } from '../DataSources/TransfersDS';
import { getAccountsAsync } from '../DataSources/AccountsDS';
import { deleteTransactionAsync } from '../DataSources/TransactionsDS';
import Note from '../Shared/Note';
import FullWidthButton from '../Shared/FullWidthButton';


export default class NewTransfer extends Component {

    static route = {
      navigationBar: {
        title: 'Převod'
      },
    }

  constructor(props : any) {
    super(props);
    this.state = {
      fromAmount: 0,
      toAmount: 0,
      fromAccount: null,
      toAccount: null,
      note: '',
      date: new Date(),
      padding: 0
    };
    // this.handleDisplayChange = this.handleDisplayChange.bind(this);
    // this.saveTransfer = this.saveTransfer.bind(this);
    // this.parseDate = this.parseDate.bind(this);
  }

  componentWillMount() {
    getAccountsAsync(accounts => {
      if (accounts.length < 2) {
        Alert.alert('Nelze přidat nový převod!', 'K provedení převodu je třeba mít přidané alespoň dva účty.');
        this.props.navigator.popToTop();
      } else {
        if (this.props.route.params.transaction) {
          let fromAccount;
          let toAccount;
          if (this.props.route.params.transaction.amount < 0) {
            fromAccount = accounts.find((account) => {
              return account._id === transaction.accountId;
            });
            toAccount = accounts[0];
            if (accounts[0] === fromAccount) {
              toAccount = accounts[1]
            }
            this.setState(
              {
                fromAccount: fromAccount,
                toAccount: toAccount,
                fromAmount: -transaction.amount,
                note: transaction.note,
                date: new Date(transaction.date)
              }
            );
          } else {
            toAccount = accounts.find((account) => {
              account._id === transaction.accountId;
            });
            fromAccount = accounts[0];
            if (accounts[0] === toAccount) {
              fromAccount = accounts[1]
            }
            this.setState(
              {
                fromAccount: fromAccount,
                toAccount: toAccount,
                fromAmount: transaction.amount,
                note: transaction.note,
                date: new Date(transaction.date)
              }
            );
          }
        } else {
          this.setState({fromAccount: accounts[0], toAccount: accounts[1]});
        }
      }
    });
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.addPadding.bind(this));
    Keyboard.addListener('keyboardDidHide', this.removePadding.bind(this));
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', (message) => {});
    Keyboard.removeListener('keyboardDidHide', (message) => {});
  }

  addPadding(event: any) {
    this.setState({padding: event.endCoordinates.height});
  }

  removePadding(event: any) {
    this.setState({padding: 0});
  }

  _scrollToInput (reactNode: any) {
    this.refs.scroll.scrollToFocusedInput(reactNode);
  }

  // handleDisplayChange(toDisplay: string) {
  //   this.setState({displayedAmount: toDisplay});
  // }

  saveTransfer() {
    let toAmount = this.state.fromAmount;
    if (this.state.fromAccount.currency !== this.state.toAccount.currency) {
      toAmount = this.state.toAmount;
    }
    saveTransferAsync({
      // fromAccountName: this.state.fromAccount.name,
      // fromAccountNumber: this.state.fromAccount.number,
      // toAccountName: this.state.toAccount.name,
      // toAccountNumber: this.state.toAccount.number,
      fromAccountId: this.state.fromAccount._id,
      toAccountId: this.state.toAccount._id,
      fromAmount: this.state.fromAmount,
      toAmount: toAmount,
      date: this.state.date,
      note: this.state.note,
      state: 'finished',
      fromCurrency: this.state.fromAccount.currency,
      toCurrency: this.state.toAccount.currency
    });
  }

  parseDate(date: string): Date {
    let dateArray = date.split('.');
    let day = parseInt(dateArray[0]);
    let month = parseInt(dateArray[1]) - 1;
    let year = parseInt(dateArray[2]);

    return new Date(year, month, day, 0, 0, 0, 0);
  }

  renderCurrency(account: Account) {
    if (account) {
      return account.currency;
    }
  }

  renderSecondAmountInput() {
    if (this.state.fromAccount
      && this.state.toAccount
      && this.state.fromAccount.currency !== this.state.toAccount.currency) {
        return (
          <View style={styles.amountInput}>
            <TextInput
              onFocus={(event: Event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target));
              }}
              defaultValue={'' + this.state.toAmount}
              style={styles.displayedAmount}
              keyboardType={'numeric'}
              selectTextOnFocus={true}
              onChangeText={(text) => this.setState({toAmount: this.getNumber(text)})} />
            <Text style={styles.currency}>{this.renderCurrency(this.state.toAccount)}</Text>
          </View>
        )
    }
  }

  getNumber(text: string): number {
    let number = parseFloat(text);
    if (text === '') {
      number = 0;
    }
    return number;
  }

  handleOnPress() {
    if (this.state.fromAccount._id === this.state.toAccount._id) {
        Alert.alert('Musíte vybrat dva různé účty.');
    } else {
      this.saveTransfer();
      if (this.props.route.params.transaction) {
        deleteTransactionAsync(this.props.route.params.transaction);
      }
      this.props.navigator.popToTop();
    }
  }

  // setAccount(selectedAccount: Account, isFromAccount: boolean) {
  //   let fromAccount = this.state.fromAccount;
  //   let toAccount = this.state.toAccount;
  //   if (isFromAccount) {
  //     if (selectedAccount._id === toAccount._id) {
  //       console.log('same');
  //       toAccount = fromAccount;
  //     }
  //     fromAccount = selectedAccount;
  //   } else {
  //     // console.log(selectedAccount);
  //     // console.log(fromAccount);
  //     if (selectedAccount._id === fromAccount._id) {
  //       console.log('same');
  //       fromAccount = toAccount;
  //     }
  //     toAccount = selectedAccount;
  //   }
  //   this.setState({fromAccount: fromAccount, toAccount: toAccount});
  // }

  render() {
    let flexSize = {flex: 1};
    if (this.state.fromAccount
      && this.state.toAccount
      && this.state.fromAccount.currecny !== this.state.toAccount.currency) {
      flexSize.flex = 2;
    }

    return (
      <View style={styles.newTransfer}>
        <View style={{flex: 8}}>
          <KeyboardAwareScrollView ref='scroll'>
            <View style={styles.datePickerView}>
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
            <View style={styles.accountsView}>
              <AccountSelector
                selectedAccount={this.state.fromAccount}
                style={styles.accountSelector}
                onAccountChange={(acc) => this.setState({fromAccount: acc})} />
              <View style={styles.arrowView}>
                <Ionicons name='ios-arrow-down' size={32} color='black' />
              </View>
              <AccountSelector
                selectedAccount={this.state.toAccount}
                style={styles.accountSelector}
                onAccountChange={(acc) => this.setState({toAccount: acc})} />
            </View>
            <View style={[styles.amountView, flexSize]}>
              <View style={styles.amountInput}>
                <TextInput
                  onFocus={(event: Event) => {
                    this._scrollToInput(ReactNative.findNodeHandle(event.target));
                  }}
                  defaultValue={'' + this.state.fromAmount}
                  style={styles.displayedAmount}
                  keyboardType={'numeric'}
                  selectTextOnFocus={true}
                  onChangeText={(text) => this.setState({fromAmount: this.getNumber(text)})} />
                <Text style={styles.currency}>{this.renderCurrency(this.state.fromAccount)}</Text>
              </View>
              {this.renderSecondAmountInput()}
            </View>
            {/* <Note
              // style={{paddingBottom: this.state.padding}}
              onFocus={(event: Event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target));
              }}
              onChangeText={(text) => {this.setState({note: text})}}
            /> */}
          </KeyboardAwareScrollView>
        </View>
        <FullWidthButton text='Uložit' onPress={this.handleOnPress.bind(this)} flexSize={1} />
        {/* <View style={styles.calculatorView}>
          <Calculator
            initialNumber={0}
            onDisplayChange={this.handleDisplayChange}
            onConfirmButtonPressed={this.saveTransfer}
            confirmButtonText='Uložit'  />
        </View> */}
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
  datePickerView: {
    // flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  accountsView: {
    // flex: 2,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center'
    // flexDirection: 'row'
  },
  amountView: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountInput: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 300,
    height: 60
  },
  displayedAmount: {
    fontSize: 30,
    width: 175,
    textAlign: 'center'
  },
  currency: {
    fontSize: 30,
    marginLeft: 10
  },
  // calculatorView: {
  //   flex: 5
  // },
  accountSelector: {
    flex: 1,
    width: 330
  },
  arrowView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
