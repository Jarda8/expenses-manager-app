/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TimeNavigation from '../Shared/TimeNavigation';
import { AddTransactionControls } from '../Shared/AddTransactionControls';
import { ExpensesCategories } from '../Shared/Categories';
import CategorySelector from '../Shared/CategorySelector';
import Balance from '../Shared/Balance';

export default class ExpensesView extends Component {

  constructor(props : any) {
    super(props);
    this.state = {
      date: new Date(),
      category: ExpensesCategories.ALL,
      balance: 21654
    };
    this.state.date.setDate(1);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleDateChange(change : number) {
    let newBalance = 0;
    let newDate = new Date (this.state.date);
    newDate.setMonth(newDate.getMonth() + change);
    if (newDate.getMonth() === 11) {
      newBalance = 18250;
    } else if (newDate.getMonth() === 10) {
      newBalance = 21654;
    }
    this.setState({date: newDate, balance: newBalance});
  }

  handleCategoryChange(category : string) {
    console.log('handleCategoryChange v ExpensesView');
    this.setState({category: category});
  }

  renderChild() {
    return React.Children.map(this.props.children, child => {
      if (child.type === CategorySelector) {
        return React.cloneElement(child, {
          category: this.state.category,
          onCategoryChange: this.handleCategoryChange
        })
      }
      else {
        return React.cloneElement(child, {
          date: this.state.date,
          category: this.state.category
        })
      }
    })
  }

  render() {
    console.log('ExpensesView render');
    return (
      <View style={styles.expensesView}>
        <View style={styles.timeNavigation}>
          <TimeNavigation onDateChange={this.handleDateChange} date={this.state.date} />
        </View>
        <View style={styles.balance}>
          <Balance balance={this.state.balance} />
        </View>
        <View style={styles.content}>
          {this.renderChild()}
        </View>
        <View style={styles.addTransactionControls}>
          <AddTransactionControls />
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
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: "center",
  },
  content: {
    flex: 4,
    // alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: 'skyblue'
  },
  addTransactionControls: {
    flex: 1,
    backgroundColor: 'steelblue'
  },
  balance: {
    flex: 0.25,
    backgroundColor: 'cyan'
  }
});
