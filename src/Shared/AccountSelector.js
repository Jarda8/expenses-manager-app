/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker } from 'react-native';

import { accountsDS } from './DataSource';

export default class AccountSelector extends Component {

  handleAccountSelected(account: any) {
    this.props.onAccountChange(account);
  }

  generateAccountsItems() {
    return accountsDS.map(
      (account) => <Picker.Item key={account.name} label={account.name} value={account} />
    )
  }

  render() {

    return (
      <View style={styles.pickerView}>
        <Text>Účet:</Text>
        <Picker
          style={styles.picker}
          selectedValue={this.props.selectedAccount}
          onValueChange={this.handleAccountSelected.bind(this)}>
          {this.generateAccountsItems()}
        </Picker>
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
  picker: {
    width: 180,
    // backgroundColor: 'white'
  }
});
