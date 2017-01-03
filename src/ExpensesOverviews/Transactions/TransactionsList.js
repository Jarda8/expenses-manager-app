/* @flow */
import React, { Component } from 'react';
import { ListView, StyleSheet, Text } from 'react-native';

import TransactionsListItem from './TransactionsListItem';

export default class TransactionsList extends Component {

  constructor(props : any) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    this.renderTransactionItem = this.renderTransactionItem.bind(this);
  }

  renderTransactionItem(transaction : any) {
    return (
      <TransactionsListItem transaction={transaction} />
    );
  }

  render() {
    var dataSource;
    if (this.props.category === 'potraviny') {
        dataSource = this.state.dataSource.cloneWithRows(
          [
            {category: 'Potraviny', amount: -160, date: '4.11.2016', note: ''},
            {category: 'Potraviny', amount: -65, date: '5.11.2016', note: 'kebab'},
            {category: 'Potraviny', amount: -420, date: '9.11.2016', note: ''},
            {category: 'Potraviny', amount: -148, date: '10.11.2016', note: ''}
          ]
        );
    } else {
        dataSource = this.state.dataSource.cloneWithRows(
          [
            {category: 'Mzda/Plat', amount: 22500, date: '4.11.2016', note: ''},
            {category: 'Potraviny', amount: -160, date: '4.11.2016', note: ''},
            {category: 'Doprava', amount: -120, date: '4.11.2016', note: 'vlak do Pardubic'},
            {category: 'Potraviny', amount: -65, date: '5.11.2016', note: 'kebab'},
            {category: 'Doprava', amount: -120, date: '5.11.2016', note: 'vlak z Pardubic'},
            {category: 'Oblečení', amount: -1150, date: '8.11.2016', note: ''},
            {category: 'Potraviny', amount: -420, date: '9.11.2016', note: ''},
            {category: 'Zábava', amount: -380, date: '10.11.2016', note: ''},
            {category: 'Potraviny', amount: -148, date: '10.11.2016', note: ''}
          ]
        );
    }
    return (
        <ListView
          dataSource={dataSource}
          renderRow={this.renderTransactionItem}
        />
    );
  }
}
