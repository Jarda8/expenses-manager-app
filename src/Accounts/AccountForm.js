/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Picker } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';

import { accountTypes, banks, saveAccount, updateAccount, currencies } from '../Shared/DataSource';
import FullWidthButton from '../Shared/FullWidthButton'

@withNavigation
export default class AccountForm extends Component {

  constructor(props: any) {
    super(props);
    if (props.account === undefined) {
      this.state = {
        type: accountTypes.keys().next().value,
        currency: currencies[0],
        name: '',
        number: '',
        bank: banks[0].name,
        initialBalance: 0
      };
    } else {
      this.state = {
        type: props.account.type,
        currency: props.account.currency,
        name: props.account.name,
        number: props.account.number ? props.account.number : '',
        bank: props.account.bankName,
        initialBalance: props.account.balance
      };
    }
  }

  saveNewAccount() {
    let number = this.state.number;
    let bank = this.state.bank;
    if (this.state.type === 'Cash') {
      number = '';
      bank = '';
    }
    saveAccount(
      {
        name: this.state.name,
        number: number,
        bankName: bank,
        type: this.state.type,
        balance: this.state.initialBalance,
        currency: this.state.currency
      }
    )
    this.props.navigator.pop();
  }

  updateOldAccount() {
    let number = this.state.number;
    let bank = this.state.bank;
    if (this.state.type === 'Cash') {
      number = '';
      bank = '';
    }
    updateAccount(
      this.props.account,
      {
        name: this.state.name,
        number: number,
        bankName: bank,
        type: this.state.type,
        balance: this.state.initialBalance,
        currency: this.state.currency
      }
    )
    this.props.navigator.pop();
  }

  generateAccountsTypesItems() {
    let accountTypesArray = [];
    accountTypes.forEach(
      (value, key) => accountTypesArray.push(<Picker.Item key={key} label={value} value={key} />)
    )
    return accountTypesArray;
  }

  generateCurrenciesItems() {
    return currencies.map(
      (currency) => <Picker.Item key={currency} label={currency} value={currency} />
    );
  }

  generateBanksItems() {
    let banksArray =  banks.map(
      (bank) => <Picker.Item key={bank.name} label={bank.name} value={bank.name} />
    );
    banksArray.push(<Picker.Item key={'other'} label={'jiná'} value={'other'} />)
    return banksArray;
  }

  renderAccountNumber() {
    if (this.state.type === 'Cash') {
      return;
    }
    return (
    <View style={styles.formTextInputItem}>
      <View style={styles.labelView}>
        <Text style={styles.label}>Číslo: </Text>
      </View>
      <TextInput
        defaultValue={'' + this.state.number}
        style={styles.textInput}
        keyboardType={'numeric'}
        onChangeText={(text) => this.setState({number: text})} />
    </View>);
  }

  renderBank() {
    if (this.state.type === 'Cash') {
      return;
    }
    return (
      <View style={styles.formItem}>
        <Text style={styles.label}>Banka: </Text>
        <Picker
          defaultValue={'' + this.state.bank}
          style={styles.pickerInput}
          selectedValue={this.state.bankName}
          onValueChange={(newBank) => this.setState({bankName: newBank})}>
          {this.generateBanksItems()}
        </Picker>
      </View>);
  }

  handleOnPress() {
    if (this.props.account === undefined) {
      this.saveNewAccount();
    } else {
      this.updateOldAccount();
    }
  }

  render() {
    return (
      <View style={styles.newAccount}>
        <View style={styles.formItems}>
          <View style={styles.formItem}>
            <Text style={styles.label}>Typ: </Text>
            <Picker
              style={styles.pickerInput}
              selectedValue={this.state.type}
              onValueChange={(newType) => this.setState({type: newType})}>
              {this.generateAccountsTypesItems()}
            </Picker>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.label}>Měna: </Text>
            <Picker
              style={styles.pickerInput}
              selectedValue={this.state.currency}
              onValueChange={(newCurrency) => this.setState({currency: newCurrency})}>
              {this.generateCurrenciesItems()}
            </Picker>
          </View>
          <View style={styles.formTextInputItem}>
            <View style={styles.labelView}>
              <Text style={styles.label}>Název: </Text>
            </View>
            <TextInput
              defaultValue={'' + this.state.name}
              style={styles.textInput}
              onChangeText={(text) => this.setState({name: text})} />
          </View>
          {this.renderAccountNumber()}
          {this.renderBank()}
          <View style={styles.formTextInputItem}>
            <View style={styles.labelView}>
              <Text style={styles.label}>Bilance: </Text>
            </View>
            <TextInput
              defaultValue={'' + this.state.initialBalance}
              style={styles.balanceTextInput}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({initialBalance: parseFloat(text)})} />
          </View>
        </View>
        <FullWidthButton text='Uložit' onPress={this.handleOnPress.bind(this)} flexSize={1} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newAccount: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  formItems: {
    flex: 8,
    margin: 10
  },
  formItem: {
    flex: 1,
    // backgroundColor: 'powderblue',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  formTextInputItem: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  labelView: {
    height: 80,
    justifyContent: 'center'
  },
  label: {
    fontSize: 20,
    // flex: 1
    width: 80
  },
  balanceLabel: {
    fontSize: 20,
    width: 200
  },
  textInput: {
    width: 250,
    fontSize: 25
  },
  balanceTextInput: {
    width: 250,
    fontSize: 25,
    textAlign: 'right'
  },
  balanceView: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'flex-start',
    justifyContent: 'center'
  },
  balanceInput: {
    // flex: 4,
    fontSize: 25,
    width: 330
    // alignItems: 'flex-end'
  },
  pickerInput: {
    // flex: 4,
    width: 250
  }
});
