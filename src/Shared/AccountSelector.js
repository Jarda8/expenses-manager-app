/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import TMPicker from 'react-native-picker-xg';

import { getAccountsAsync } from '../DataSources/AccountsDS';

export default class AccountSelector extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      accounts: []
    }
  }

  componentWillMount(){
    getAccountsAsync(result => {this.setState({accounts: result});});
  }

  handleAccountSelected(accountName: string) {
    // this.props.onAccountChange(account);
    for (account of this.state.accounts) {
      if (account.name === accountName) {
        this.props.onAccountChange(account);
        break;
      }
    }
  }

  generateAccountItems() {
    // return this.state.accounts.map(
    //   (account) => <Picker.Item key={account.name} label={account.name} value={account} />
    var items = [{}];
    for (account of this.state.accounts) {
      items[0][account.name] = {name: account.name};
    }
    return items;
  }

  renderPicker() {
    if (this.state.accounts.length !== 0 && this.props.selectedAccount !== null) {
      return (
        <TMPicker
          inputValue ={this.props.selectedAccount.name}
          inputStyle = {styles.picker}
          confirmBtnText = {'potvrdit'}
          cancelBtnText = {'zrušit'}
          data = {this.generateAccountItems()}
          // selectIndex = {[0,1]}
          onResult ={this.handleAccountSelected.bind(this)}
          visible = {false}
        />
      )
    }
  }

  render() {

    return (
      <View style={this.props.style}>
        {/* <Text>Účet:</Text> */}
        {/* <Picker
          style={styles.picker}
          selectedValue={this.props.selectedAccount}
          onValueChange={this.handleAccountSelected.bind(this)}>
          {this.generateAccountItems()}
        </Picker> */}
        {this.renderPicker()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'aquamarine',
    justifyContent: 'center'
  },
  // picker: {
  //   width: 180,
  //   // backgroundColor: 'white'
  // }
});
