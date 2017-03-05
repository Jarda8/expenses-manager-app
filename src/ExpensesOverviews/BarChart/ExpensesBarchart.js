/* @flow */
import React, { Component } from 'react';
import { Bar } from 'react-native-pathjs-charts';
import { View, StyleSheet, Text } from 'react-native';

import { All } from '../../Shared/Categories';
import { getSumOfTransactionsAsync, getSumOfExpensesAsync, TRANSACTIONS_DS_EVENT_EMITTER } from '../../DataSources/TransactionsDS';
import { periods } from '../../Shared/DataSource';

export class ExpensesBarchart extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    }
    this.period = '';
  }

  componentWillMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fromDate !== this.props.fromDate
      || nextProps.toDate !== this.props.toDate
      || nextProps.category !== this.props.category) {
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
    let fromDate = new Date(props.fromDate);
    let toDate = new Date(props.fromDate);

    if (props.period === periods.get('month')) {
      if (this.period !== props.period) {
        this.period = props.period;
        this.setState({data:
          [
            {name: '1.týden', amount: 0},
            {name: '2.týden', amount: 0},
            {name: '3.týden', amount: 0},
            {name: '4.týden', amount: 0}
          ]});
      }
      toDate.setDate(fromDate.getDate() + 7);
      toDate.setMilliseconds(-1);

      for (var i = 0; i < 4; i++) {
        if (i === 3) {
          toDate = props.toDate;
        }
        if (props.category === All) {
          let j = i;
          getSumOfExpensesAsync(fromDate, toDate, result => {
            let newData = this.state.data;
            newData[j] = result;
            newData[j].amount = -newData[j].amount;
            newData[j].name = '' + (j + 1) + '. týden';
            this.setState({data: newData});
          });
        } else {
          let j = i;
          getSumOfTransactionsAsync(props.category, fromDate, toDate, result => {
            let newData = this.state.data;
            newData[j] = result;
            newData[j].amount = -newData[j].amount;
            newData[j].name = '' + (j + 1) + '. týden';
            this.setState({data: newData});
          });
        }
        fromDate = toDate;
        toDate = new Date(toDate);
        fromDate.setMilliseconds(fromDate.getMilliseconds() + 1);
        toDate.setDate(toDate.getDate() + 7)
      }
    }
  }

  renderChart() {

    if (!this.state.data.find(x => x.amount !== 0)) {
      return <Text>Žádné údaje</Text>
    } else {
      return (
      <Bar data={[this.state.data]} options={options} accessorKey="amount" />
      )
    }
  }

  render() {
    return (
      <View style={[styles.chart, this.props.style]}>
        {this.renderChart()}
      </View>
    );
  }
}

  const options = {
    width: 250,
    height: 250,
    margin: {
      top: 20,
      left: 25,
      bottom: 50,
      right: 20
    },
    color: '#2980B9',
    gutter: 20,
    // animate: {
    //   type: 'oneByOne',
    //   duration: 200,
    //   fillTransition: 3
    // },
    axisX: {
      showAxis: true,
      showLines: true,
      showLabels: true,
      showTicks: true,
      zeroAxis: false,
      orient: 'bottom',
      label: {
        fontFamily: 'Arial',
        fontSize: 8,
        fontWeight: true,
        fill: '#34495E'
      }
    },
    axisY: {
      showAxis: false,
      showLines: true,
      showLabels: true,
      showTicks: true,
      zeroAxis: false,
      orient: 'left',
      label: {
        fontFamily: 'Arial',
        fontSize: 8,
        fontWeight: true,
        fill: '#34495E'
      }
    }
  };

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
