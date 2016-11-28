/* @flow */
import React, { Component } from 'react';
import { ListView, StyleSheet, Text } from 'react-native';

import AccountsView from './AccountsView';
import AccountsListItem from './AccountsListItem';

export default class AccountsListView extends Component {

    static route = {
      navigationBar: {
        title: 'Účty'
      },
    }

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(
        [
          {name: 'Osobní účet', type: 'Bankovní účet', balance: 19500},
          {name: 'Peněženka', type: 'Hotovost', balance: 2154}
        ]),
    };
    this.renderAccountItem = this.renderAccountItem.bind(this);
  }

  renderAccountItem(account : any) {
    return (
      <AccountsListItem account={account} />
    );
  }

  render() {
    return (
      <AccountsView>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderAccountItem}
        />
      </AccountsView>
    );
  }
}
