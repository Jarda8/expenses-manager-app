/* @flow */
import React, { Component } from 'react';
import { Pie } from 'react-native-pathjs-charts';
import { View, StyleSheet } from 'react-native';

import { getSumsOfExpensesByCategoryAsync } from '../../DataSources/TransactionsDS';
import { ExpensesCategories } from '../../Shared/Categories';

export class ExpensesPiechart extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    getSumsOfExpensesByCategoryAsync(this.props.fromDate, this.props.toDate, result => {
      for (category of result) {
        category.name = ExpensesCategories[category.name];
      };
      this.setState({data: result});
    })
  }

  render() {
    // let data = getSumsOfExpensesByCategory(this.props.fromDate, this.props.toDate);

    var options = {
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      width: 300,
      height: 300,
      color: '#2980B9',
      r: 50,
      R: 120,
      legendPosition: 'topLeft',
      // animate: {
      //   type: 'oneByOne',
      //   duration: 200,
      //   fillTransition: 3
      // },
      label: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: true,
        color: '#000'
      }
    }

    return (
    <View style={[styles.chart, this.props.style]}>
      <Pie
        data={this.state.data}
        options={options}
        accessorKey="amount" />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
