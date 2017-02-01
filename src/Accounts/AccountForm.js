/* @flow */
import React, { Component } from 'react';
import ReactNative, { Keyboard, View, ScrollView, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TMPicker from '../../modifiedLibraries/react-native-picker-xg/app/picker';

import { banks, currencies } from '../Shared/DataSource';
import { accountTypes, saveAccountAsync, updateAccountAsync } from '../DataSources/AccountsDS';
import FullWidthButton from '../Shared/FullWidthButton'
import CSAPIClient from '../DataImport/CSAPIClient';

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
        initialBalance: 0,
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
        initialBalance: props.account.balance,
        padding: 0
      };
    }
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.addPadding.bind(this))
    Keyboard.addListener('keyboardDidHide', this.removePadding.bind(this))
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', (message) => {})
    Keyboard.removeListener('keyboardDidHide', (message) => {})
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
    if (this.state.type === 'Bank account' && bank !== 'other') {
      switch (bank) {
        case 'Česká spořitelna':
          CSAPIClient.fetchAccount(this.state.name, number).then(acc => {
            if (acc === null) {
              Alert.alert('Import účtu se nezdařil!', 'Při importu dat z vaší banky došlo k chybě. Zkontrolujte si prosím zadané číslo účtu.');
            } else {
              console.log(acc);
              saveAccountAsync(acc);
              this.props.navigator.pop();
            }
          }).catch(() => console.log("Promise Rejected"));
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
          balance: this.state.initialBalance,
          currency: this.state.currency
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
        balance: this.state.initialBalance,
        currency: this.state.currency
      }
    )
    this.props.navigator.pop();
  }

  // generateCurrenciesItems() {
  //   return currencies.map(
  //     (currency) => <Picker.Item key={currency} label={currency} value={currency} />
  //   );
  // }

  generateBanksItems() {
    let banksArray =  banks.map(
      (bank) => <Picker.Item key={bank.name} label={bank.name} value={bank.name} />
    );
    banksArray.push(<Picker.Item key={'other'} label={'jiná - bez automatické synchronizace'} value={'other'} />)
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
        {/* <Picker
          style={styles.pickerInput}
          selectedValue={this.state.bank}
          onValueChange={(newBank) => this.setState({bank: newBank})}>
          {this.generateBanksItems()}
        </Picker> */}
        <TMPicker
          inputValue ={this.state.bank}
          inputStyle = {styles.pickerInput}
          confirmBtnText = {'potvrdit'}
          cancelBtnText = {'zrušit'}
          data = {banksPickerData}
          // selectIndex = {[0,1]}
          onResult ={(newBank) => this.setState({bank: newBank})}
          visible = {false}
        />
      </View>);
  }

  renderCurrency() {
    if (this.state.type === 'Bank account' && this.state.bank !== 'other') {
      return;
    }
    return (
    <View style={styles.formItem}>
      <Text style={styles.label}>Měna: </Text>
      {/* <Picker
        style={styles.pickerInput}
        selectedValue={this.state.currency}
        onValueChange={(newCurrency) => this.setState({currency: newCurrency})}>
        {this.generateCurrenciesItems()}
      </Picker> */}
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
    if (this.state.type === 'Bank account' && this.state.bank !== 'other') {
      return;
    }
    return (
      <View style={[styles.formTextInputItem, {paddingBottom: this.state.padding}]}>
        <View style={styles.labelView}>
          <Text style={styles.label}>Bilance: </Text>
        </View>
        <TextInput
          onFocus={(event: Event) => {
            this._scrollToInput(ReactNative.findNodeHandle(event.target));
          }}
          defaultValue={'' + this.state.initialBalance}
          style={styles.balanceTextInput}
          keyboardType={'numeric'}
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

  changeBalance(text: string) {
    let number = parseFloat(text);
    if (text === '') {
      number = 0;
    }
    this.setState({initialBalance: number});
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
        {/* <ScrollView style={{flex: 1}} contentContainerStyle={{flex: 1}} > */}
        <View style={styles.formItems}>
          <KeyboardAwareScrollView ref='scroll'>
            <View style={styles.formItem}>
              <Text style={styles.label}>Typ: </Text>
              {/* <Picker
                style={styles.pickerInput}
                selectedValue={this.state.type}
                onValueChange={(newType) => this.setState({type: newType})}>
                {this.generateAccountsTypesItems()}
              </Picker> */}
              <TMPicker
                inputValue ={accountTypes.get(this.state.type)}
                inputStyle = {styles.pickerInput}
                confirmBtnText = {'potvrdit'}
                cancelBtnText = {'zrušit'}
                data = {accountTypesPickerData}
                // selectIndex = {[0,1]}
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

// generateAccountsTypesItems() {
//   let accountTypesArray = [];
//   accountTypes.forEach(
//     (value, key) => accountTypesArray.push(<Picker.Item key={key} label={value} value={key} />)
//   )
//   return accountTypesArray;
// }

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
    justifyContent: 'center'
  },
  label: {
    fontSize: 20,
    width: 80
  },
  textInput: {
    width: 250,
    fontSize: 20,
    height: 70
  },
  balanceTextInput: {
    width: 250,
    fontSize: 20,
    textAlign: 'right',
    height: 70
  },
  pickerInput: {
    width: 250
  }
});
