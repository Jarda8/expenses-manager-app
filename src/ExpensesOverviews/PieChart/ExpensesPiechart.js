/* @flow */
import React, { Component } from 'react';
import { Pie } from 'react-native-pathjs-charts';
import { View, StyleSheet } from 'react-native';

import { getSumsOfExpensesByCategory } from '../../Shared/DataSource';
import { ExpensesCategories } from '../../Shared/Categories';

export class ExpensesPiechart extends Component {
  render() {
    let data = getSumsOfExpensesByCategory(this.props.fromDate, this.props.toDate);
    for (category of data) {
      category.name = ExpensesCategories[category.name];
    }

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
        data={data}
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
