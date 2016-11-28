/* @flow */
import React, { Component } from 'react';
import { Pie } from 'react-native-pathjs-charts';
import { View, StyleSheet } from 'react-native';

export class ExpensesPiechart extends Component {
  render() {
    var data;
    if (this.props.date.getMonth() === 10) {
      data = [{
        "name": "potraviny",
        "amount": 2500
      }, {
        "name": "oblečení",
        "amount": 1200
      }, {
        "name": "doprava",
        "amount": 600
      }, {
        "name": "zábava",
        "amount": 1000
      }, {
        "name": "domácí mazlíčci",
        "amount": 500
      }, {
        "name": "zdraví",
        "amount": 300
      }];
    } else if (this.props.date.getMonth() === 11) {
      data = [{
        "name": "potraviny",
        "amount": 2800
      }, {
        "name": "doprava",
        "amount": 750
      }, {
        "name": "zábava",
        "amount": 600
      }, {
        "name": "domácí mazlíčci",
        "amount": 500
      }, {
        "name": "dárky",
        "amount": 450
      }];
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
    <View style={styles.chart}>
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
    alignItems: 'center'
  }
});
