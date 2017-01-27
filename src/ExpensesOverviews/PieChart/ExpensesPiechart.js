/* @flow */
import React, { Component } from 'react';
import { Pie } from 'react-native-pathjs-charts';
import { View, StyleSheet, Text } from 'react-native';

import { getSumsOfExpensesByCategoryAsync, TRANSACTIONS_DS_EVENT_EMITTER } from '../../DataSources/TransactionsDS';
import { ExpensesCategories } from '../../Shared/Categories';

export class ExpensesPiechart extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fromDate !== this.props.fromDate
      || nextProps.toDate !== this.props.toDate) {
      this.loadData(nextProps);
    }
  }

  componentDidMount() {
    this.transactionsChangedSubsrcibtion =
      TRANSACTIONS_DS_EVENT_EMITTER.addListener('transactionsChanged',
        () => this.loadData(this.props));
  }

  componentWillUnmount() {
    this.transactionsChangedSubsrcibtion.remove();
  }

  loadData(props) {
    getSumsOfExpensesByCategoryAsync(props.fromDate, props.toDate, result => {
      for (category of result) {
        category.name = ExpensesCategories[category.name];
      };
      this.setState({data: result});
    })
  }

  renderChart() {
    if (this.state.data.length === 0) {
      return <Text>Žádné údaje</Text>
    } else {
      return <Pie data={this.state.data} options={options} accessorKey="amount" />
    }
  }

  render() {
    // let data = getSumsOfExpensesByCategory(this.props.fromDate, this.props.toDate);

    return (
    <View style={[styles.chart, this.props.style]}>
      {this.renderChart()}
    </View>
    );
  }
}

const options = {
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

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
