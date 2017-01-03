/* @flow */
import React, { Component } from 'react';
import { ListView } from 'react-native';

import BudgetView from './BudgetView';
import BudgetListItem from './BudgetListItem';
import { ExpensesCategories } from '../Shared/Categories';

export default class BudgetListView extends Component {

    static route = {
      navigationBar: {
        title: 'Limity'
      },
    }

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(
        [
          {category: ExpensesCategories.FOOD, budget: 5000},
          {category: ExpensesCategories.TRANSPORT, budget: 500},
          {category: ExpensesCategories.ALL, budget: 15000}
        ]),
    };
    this.renderBudgetItem = this.renderBudgetItem.bind(this);
  }

  renderBudgetItem(budget : any) {
    return (
      <BudgetListItem budgetItem={budget} />
    );
  }

  render() {
    return (
      <BudgetView>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderBudgetItem}
        />
      </BudgetView>
    );
  }
}
