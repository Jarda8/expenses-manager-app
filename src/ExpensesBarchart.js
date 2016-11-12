/* @flow */
import React, { Component } from 'react';
import { Bar } from 'react-native-pathjs-charts'

export class ExpensesBarchart extends Component {
  render() {
    var data;
    if (this.props.date.getMonth() === 10) {
      data = [
        [{
          "amount": 700,
          "name": "1. týden"
        }, {
          "amount": 1500,
          "name": "2. týden"
        }, {
          "amount": 900,
          "name": "3. týden"
        }, {
          "amount": 3000,
          "name": "4. týden"
        }]
      ];
    } else if (this.props.date.getMonth() === 11) {
      data = [
        [{
          "amount": 1000,
          "name": "1. týden"
        }, {
          "amount": 500,
          "name": "2. týden"
        }, {
          "amount": 800,
          "name": "3. týden"
        }, {
          "amount": 700,
          "name": "4. týden"
        }]
      ];
    }

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
      <Bar
        data={data}
        options={options}
        accessorKey="amount" />
    );
  }
}
