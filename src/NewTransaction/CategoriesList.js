/* @flow */
import React, { Component } from 'react';
import { View, ListView, StyleSheet, Text } from 'react-native';

import CategoriesListItem from './CategoriesListItem';
import { transactionsDS } from '../Shared/DataSource'

export default class CategoriesList extends Component {

  static route = {
    navigationBar: {
      title: 'Výběr kategorie'
    },
  }

  constructor(props: any) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let categories: Array<string> = this.getCategoriesArray(props.route.params.categories);
    this.state = {
      dataSource: ds.cloneWithRows(categories)
    };
    this.renderCategoryItem = this.renderCategoryItem.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
  }

  getCategoriesArray(categoriesObject: {[id:string]: string}): Array<string> {
    return Object.keys(categoriesObject).map(
      (category) => category
    )
  }

  renderCategoryItem(categoryKey: string) {
    return (
      <CategoriesListItem
        category={this.props.route.params.categories[categoryKey]}
        categoryKey={categoryKey}
        onCategorySelected={this.saveTransaction} />
    );
  }

  saveTransaction(category: string) {
    transactionsDS.push(
      {
        category: category,
        amount: this.props.route.params.amount * this.props.route.params.ifExpenseMinusOne,
        // category: 'FOOD',
        // amount: -25,
        date: new Date(),
        note: this.props.route.params.note
    });
    this.props.navigator.popToTop();
  }

  render() {
    return (
      <View>
        <View style={styles.amountView}>
          <Text style={styles.displayedAmount}>{this.props.route.params.amount}</Text>
          {/* TODO lokalizovat měnu */}
          <Text style={styles.currency}>CZK</Text>
        </View>
        <ListView
          contentContainerStyle={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderCategoryItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center'
  },
  displayedAmount: {
    fontSize: 30
  },
  currency: {
    fontSize: 30,
    marginLeft: 10
  }
});
