/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TimeNavigation from '../Shared/TimeNavigation';
import { AddTransactionControls } from '../Shared/AddTransactionControls';
import { ExpensesCategories, All } from '../Shared/Categories';
import CategorySelector from '../Shared/CategorySelector';
import { periods } from '../Shared/DataSource';
import BalanceBar from './BalanceBar/BalanceBar';

export default class ExpensesView extends Component {

  constructor(props : any) {
    super(props);
    let date = new Date();
    this.state = {
      fromDate: new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0),
      toDate: new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, -1),
      category: All,
      period: periods.get('month')
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleDateChange(change: number) {
    let newFromDate = new Date(this.state.fromDate);
    let newToDate = new Date(this.state.toDate);
    if (this.state.period === periods.get('month')) {
      newFromDate.setMonth(newFromDate.getMonth() + change);
      newToDate.setMonth(newToDate.getMonth() + change);

      if (newToDate.getDate() === 1 || newToDate.getDate() === 2 || newToDate.getDate() === 3) {
        newToDate.setDate(0);
      } else if (newToDate.getDate() === 30 || newToDate.getDate() === 29 || newToDate.getDate() === 28) {
        let testDate = new Date(newToDate);
        testDate.setDate(31);
        if (testDate.getDate() === 31) {
          newToDate.setDate(31);
        }
      }

    } else {
      newFromDate.setDate(newFromDate.getDate() + change);
      newToDate.setDate(newToDate.getDate() + change);
    }
    this.setState({fromDate: newFromDate, toDate: newToDate});
  }

  handleCategoryChange(category : string) {
    this.setState({category: category});
  }

  renderChild() {
    return React.Children.map(this.props.children, child => {
      if (child.type === CategorySelector) {
        return React.cloneElement(child, {
          category: this.state.category,
          onCategoryChange: this.handleCategoryChange,
          style: {flex: 1}
        })
      }
      else {
        return React.cloneElement(child, {
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
          category: this.state.category,
          period: this.state.period,
          style: {flex: 6}
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.expensesView}>
        <View style={styles.timeNavigation}>
          <TimeNavigation
            onDateChange={this.handleDateChange}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            period={this.state.period}
          />
        </View>
        <BalanceBar style={styles.balance} fromDate={this.state.fromDate} toDate={this.state.toDate} />
        <View style={styles.content}>
          {this.renderChild()}
        </View>
        <View style={styles.addTransactionControls}>
          <AddTransactionControls navigator={this.props.navigator} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  expensesView: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  timeNavigation: {
    flex: 0.7,
    justifyContent: "center",
  },
  content: {
    flex: 4,
    justifyContent: "space-around"
  },
  addTransactionControls: {
    flex: 1,
    backgroundColor: 'steelblue'
  },
  balance: {
    flex: 0.25
  }
});
