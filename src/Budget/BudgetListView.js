/* @flow */
import React, { Component } from 'react';
import { ListView } from 'react-native';

import BudgetView from './BudgetView';
import BudgetListItem from './BudgetListItem';
import { ExpensesCategories } from '../Shared/Categories';
import { getBudgetsAsync, BUDGETS_DS_EVENT_EMITTER } from '../DataSources/BudgetsDS';

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

  componentWillMount() {
    this.loadData();
  }

  componentDidMount() {
    this.budgetsChangedSubsrcibtion =
      BUDGETS_DS_EVENT_EMITTER.addListener('budgetsChanged', this.loadData.bind(this));
  }

  componentWillUnmount() {
    this.budgetsChangedSubsrcibtion.remove();
  }

  loadData() {
    getBudgetsAsync(result =>
      this.setState({dataSource: this.state.dataSource.cloneWithRows(result)}));
  }

  renderBudgetItem(budget : any) {
    return (
      <BudgetListItem budgetItem={budget} />
    );
  }

  // getBudgetsDS() {
  //   return this.state.dataSource.cloneWithRows(getBudgets());
  // }

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
