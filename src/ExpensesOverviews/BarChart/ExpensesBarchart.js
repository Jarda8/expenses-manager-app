/* @flow */
import React, { Component } from 'react';
import { Bar } from 'react-native-pathjs-charts';
import { View, StyleSheet } from 'react-native';

import { All } from '../../Shared/Categories';
import { getSumOfTransactionsAsync, getSumOfExpensesAsync } from '../../DataSources/TransactionsDS';
import { periods } from '../../Shared/DataSource';

export class ExpensesBarchart extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    let fromDate = new Date(this.props.fromDate);
    let toDate = new Date(this.props.fromDate);

    if (this.props.period === periods.get('month')) {
      this.setState({data:
        [
          {name: '1.týden', amount: 1},
          {name: '2.týden', amount: 1},
          {name: '3.týden', amount: 1},
          {name: '4.týden', amount: 1}
        ]});
      toDate.setDate(fromDate.getDate() + 7);
      toDate.setMilliseconds(-1);

      for (var i = 0; i < 4; i++) {
        if (i === 3) {
          toDate = this.props.toDate;
        }
        if (this.props.category === All) {
          let j = i;
          getSumOfExpensesAsync(fromDate, toDate, result => {
            let newData = this.state.data;
            newData[j] = result;
            newData[j].amount = -newData[j].amount;
            newData[j].name = '' + (j + 1) + '. týden';
            console.log(newData);
            this.setState({data: newData});
          });
        } else {
          getSumOfTransactionsAsync(this.props.category, fromDate, toDate, result => {
            let newData = this.state.data;
            newData[i] = result;
            newData[i].amount = -newData[i].amount;
            newData[i].name = '' + (i + 1) + '. týden';
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

  // getData() {
  //   let data = [];
  //   let fromDate = new Date(this.props.fromDate);
  //   let toDate = new Date(this.props.fromDate);
  //
  //   if (this.props.period === periods.get('month')) {
  //     toDate.setDate(fromDate.getDate() + 7);
  //     toDate.setMilliseconds(-1);
  //
  //     for (var i = 1; i <= 4; i++) {
  //       if (i === 4) {
  //         toDate = this.props.toDate;
  //       }
  //       if (this.props.category === All) {
  //         data.push(getSumOfExpenses(fromDate, toDate));
  //       } else {
  //         data.push(getSumOfTransactions(this.props.category, fromDate, toDate));
  //       }
  //       data[i - 1].amount = -data[i - 1].amount;
  //       data[i - 1].name = '' + i + '. týden';
  //       fromDate = toDate;
  //       toDate = new Date(toDate);
  //       fromDate.setMilliseconds(fromDate.getMilliseconds() + 1);
  //       toDate.setDate(toDate.getDate() + 7)
  //     }
  //   }
  //   if (data.find((x) => x.amount !== 0) === undefined) {
  //     return;
  //   }
  //   return [data];
  // }

  render() {
    var options = {
      width: 250,
      height: 250,
      color: '#2980B9',
      gutter: 20,
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
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

    return (
    <View style={[styles.chart, this.props.style]}>
      <Bar
        data={[this.state.data]}
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
