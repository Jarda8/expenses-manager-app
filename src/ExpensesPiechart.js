/* @flow */
import React, { Component } from 'react';
import { Pie } from 'react-native-pathjs-charts'

export class ExpensesPiechart extends Component {
  render() {
    var data;
    if (this.props.date.getMonth() === 10) {
      data = [{
        "name": "Alagoas",
        "population": 1962903
      }, {
        "name": "Maranhão",
        "population": 2805387
      }, {
        "name": "São Paulo",
        "population": 6460102
      }, {
        "name": "Goiás",
        "population": 4157509
      }, {
        "name": "Sergipe",
        "population": 2637097
      }, {
        "name": "Rondônia",
        "population": 3552899
      }];
    } else if (this.props.date.getMonth() === 11) {
      data = [{
        "name": "Alagoas",
        "population": 196290
      }, {
        "name": "Maranhão",
        "population": 2387
      }, {
        "name": "São Paulo",
        "population": 4460102
      }, {
        "name": "Goiás",
        "population": 4687509
      }, {
        "name": "Sergipe",
        "population": 263709
      }, {
        "name": "Rondônia",
        "population": 355289
      }];
    }

    var options = {
      margin: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      },
      width: 300,
      height: 300,
      color: '#2980B9',
      r: 50,
      R: 100,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: true,
        color: '#000'
      }
    }

    return (
      <Pie
        data={data}
        options={options}
        accessorKey="population" />
    );
  }
}
