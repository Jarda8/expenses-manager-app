/* @flow */
import React, { Component } from 'react';
import ReactNative, { Keyboard, View, ScrollView, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TMPicker from '../../modifiedLibraries/react-native-picker-xg/app/picker';

import { banks, currencies } from '../Shared/DataSource';
import { accountTypes, saveAccountAsync, updateAccountAsync } from '../DataSources/AccountsDS';
import FullWidthButton from '../Shared/FullWidthButton';
import { Router } from '../../main';

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
        initialBalance: '0',
        padding: 0
      };
    } else {
      let bank = props.account.bankName;
      if (bank === '') {
        bank = banks[0].name;
      }
      this.state = {
        type: props.account.type,
        currency: props.account.currency,
        name: props.account.name,
        number: props.account.number ? props.account.number : '',
        bank: bank,
        initialBalance: '' + props.account.balance,
        padding: 0
      };
    }
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

  saveNewAccount() {
    let number = this.state.number;
    let bank = this.state.bank;
    if (this.state.type === 'Cash') {
      number = null;
      bank = null;
    }
    if (this.state.type === 'Bank account' && bank !== 'Jiná') {
      switch (bank) {
        case 'Česká spořitelna':
          this.props.navigator.push(Router.getRoute('csTokensForm', {accountName: this.state.name, accountNumber: number}));
          break;
      }
    } else {
      saveAccountAsync(
        {
          name: this.state.name,
          number: number,
          iban: null,
          bankName: bank,
          type: this.state.type,
          balance: parseFloat(this.state.initialBalance),
          currency: this.state.currency,
          connected: false
        }
      );
      this.props.navigator.pop();
    }
  }

  updateOldAccount() {
    let number = this.state.number;
    let bank = this.state.bank;
    if (this.state.type === 'Cash') {
      number = '';
      bank = '';
    }
    updateAccountAsync(
      this.props.account,
      {
        name: this.state.name,
        number: number,
        bankName: bank,
        type: this.state.type,
        balance: parseFloat(this.state.initialBalance),
        currency: this.state.currency
      }
    )
    this.props.navigator.pop();
  }

  // generateBanksItems() {
  //   let banksArray =  banks.map(
  //     (bank) => <Picker.Item key={bank.name} label={bank.name} value={bank.name} />
  //   );
  //   banksArray.push(<Picker.Item key={'other'} label={'jiná - bez automatické synchronizace'} value={'other'} />)
  //   return banksArray;
  // }

  setAccountNumber(number: string) {
    let pattern = /^[0-9]*$/;
    if (pattern.test(number)) {
      this.setState({number: number})
    }
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
        // defaultValue={'' + this.state.number}
        value={'' + this.state.number}
        style={styles.textInput}
        keyboardType={'numeric'}
        maxLength={13}
        onChangeText={this.setAccountNumber.bind(this)} />
    </View>);
  }

  renderBank() {
    if (this.state.type === 'Cash') {
      return;
    }
    return (
      <View style={styles.formItem}>
        <Text style={styles.label}>Banka: </Text>
        <TMPicker
          inputValue ={this.state.bank}
          inputStyle = {styles.pickerInput}
          confirmBtnText = {'potvrdit'}
          cancelBtnText = {'zrušit'}
          data = {banksPickerData}
          onResult ={(newBank) => this.setState({bank: newBank})}
          visible = {false}
        />
      </View>);
  }

  renderCurrency() {
    if (this.state.type === 'Bank account' && this.state.bank !== 'Jiná') {
      return;
    }
    return (
    <View style={styles.formItem}>
      <Text style={styles.label}>Měna: </Text>
      <TMPicker
        inputValue ={this.state.currency}
        inputStyle = {styles.pickerInput}
        confirmBtnText = {'potvrdit'}
        cancelBtnText = {'zrušit'}
        data = {currenciesPickerData}
        onResult ={newCurrency => this.setState({currency: newCurrency})}
        visible = {false}
      />
    </View>);
  }

  renderBalance() {
    if (this.state.type === 'Bank account' && this.state.bank !== 'Jiná') {
      return;
    }
    return (
      <View style={[styles.formTextInputItem, {paddingBottom: this.state.padding}]}>
        <View style={styles.labelView}>
          <Text style={styles.label}>Zůstatek: </Text>
        </View>
        <TextInput
          onFocus={(event: Event) => {
            this._scrollToInput(ReactNative.findNodeHandle(event.target));
          }}
          value={this.state.initialBalance}
          style={styles.balanceTextInput}
          keyboardType={'numeric'}
          maxLength={12}
          selectTextOnFocus={true}
          onChangeText={this.changeBalance.bind(this)} />
      </View>
    )
  }

  handleOnPress() {
    if (this.props.account === undefined) {
      this.saveNewAccount();
    } else {
      this.updateOldAccount();
    }
  }

  changeBalance(input: string) {
    let pattern = /(^-?[0-9]*\.?[0-9]{0,2}$)/;
    if (pattern.test(input)) {
      if (input === '') {
        input = '0';
      }
      this.setState({initialBalance: input});
    }
  }

  _scrollToInput (reactNode: any) {
    this.refs.scroll.scrollToFocusedInput(reactNode)
  }

  setType(type: string) {
    accountTypes.forEach(
      (value, key) => {
        if (value === type) {
          this.setState({type: key})
          return;
        }
      }
    )
  }

  render() {
    return (
      <View style={styles.accountForm}>
        <View style={styles.formItems}>
          <KeyboardAwareScrollView ref='scroll'>
            <View style={styles.formItem}>
              <Text style={styles.label}>Typ: </Text>
              <TMPicker
                inputValue ={accountTypes.get(this.state.type)}
                inputStyle = {styles.pickerInput}
                confirmBtnText = {'potvrdit'}
                cancelBtnText = {'zrušit'}
                data = {accountTypesPickerData}
                onResult ={this.setType.bind(this)}
                visible = {false}
              />
            </View>
            {this.renderBank()}
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
            {this.renderCurrency()}
            {this.renderBalance()}
          </KeyboardAwareScrollView>
        </View>
        <FullWidthButton text='Uložit' onPress={this.handleOnPress.bind(this)} flexSize={1} />
      </View>
    );
  }
}

const accountTypesPickerData = (() => {
  var items = [{}];
  accountTypes.forEach(
    (value, key) => items[0][key] = {name: value}
  );
  return items;
})();

const banksPickerData = (() => {
  var items = [{}];
  for (bank of banks) {
    items[0][bank.name] = {name: bank.name};
  }
  items[0]['other'] = {name: 'Jiná'};
  return items;
})();

const currenciesPickerData = (() => {
  var items = [{}];
  for (currency of currencies) {
    items[0][currency] = {name: currency};
  }
  return items;
})();

const styles = StyleSheet.create({
  accountForm: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  formItems: {
    flex: 8,
    margin: 10
  },
  formItem: {
    height: 70,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  formTextInputItem: {
    height: 70,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  labelView: {
    height: 70,
    justifyContent: 'center',
    width: 85
  },
  label: {
    fontSize: 20,
    width: 85
  },
  textInput: {
    width: 220,
    fontSize: 20,
    height: 70,
    marginLeft: 20
  },
  balanceTextInput: {
    width: 200,
    fontSize: 20,
    textAlign: 'right',
    height: 70
  },
  pickerInput: {
    width: 180
  }
});
