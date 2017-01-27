/* @flow */
import React, { Component } from 'react';
import { ListView } from 'react-native';

import AccountsView from './AccountsView';
import AccountsListItem from './AccountsListItem';
import { getAccountsAsync, ACCOUNTS_DS_EVENT_EMITTER } from '../DataSources/AccountsDS';
import TransferButton from './TransferButton';

export default class AccountsListView extends Component {

    static route = {
      navigationBar: {
        title: 'Účty',
        renderRight: (route, props) =>
          <TransferButton />
      },
    }

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    this.renderAccountItem = this.renderAccountItem.bind(this);
  }

  componentWillMount(){
    this.loadData();
  }

  componentDidMount() {
    this.accountsChangedSubsrcibtion =
      ACCOUNTS_DS_EVENT_EMITTER.addListener('accountsChanged', this.loadData.bind(this));
  }

  componentWillUnmount() {
    this.accountsChangedSubsrcibtion.remove();
  }

  renderAccountItem(account : any) {
    return (
      <AccountsListItem account={account} />
    );
  }

  loadData() {
    getAccountsAsync(result => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(result)});
    });
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
