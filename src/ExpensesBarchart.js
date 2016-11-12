/* @flow */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {Bar} from 'react-native-pathjs-charts'

export class ExpensesBarchart extends Component {
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
            <Bar
              data={this.props.data}
              options={options}
              accessorKey="amount" />
        );
    }
}
