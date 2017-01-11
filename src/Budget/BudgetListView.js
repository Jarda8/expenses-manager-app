/* @flow */
import React, { Component } from 'react';
import { ListView } from 'react-native';

import BudgetView from './BudgetView';
import BudgetListItem from './BudgetListItem';
import { ExpensesCategories } from '../Shared/Categories';
import { getBudgets } from '../Shared/DataSource';

export default class BudgetListView extends Component {

    static route = {
      navigationBar: {
        title: 'Rozpočet'
      },
    }

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    this.renderBudgetItem = this.renderBudgetItem.bind(this);
  }

  renderBudgetItem(budget : any) {
    return (
      <BudgetListItem budgetItem={budget} />
    );
  }

  getBudgetsDS() {
    return this.state.dataSource.cloneWithRows(getBudgets());
  }

  render() {
    return (
      <BudgetView>
        <ListView
          dataSource={this.getBudgetsDS()}
          renderRow={this.renderBudgetItem}
        />
      </BudgetView>
    );
  }
}
