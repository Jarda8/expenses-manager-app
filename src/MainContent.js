/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { ExpensesPiechart } from './ExpensesPiechart'
import { ExpensesBarchart } from './ExpensesBarchart'
import { TimeNavigation } from './TimeNavigation'
import { AddTransactionControls } from './AddTransactionControls'

export default class MainContent extends Component {

  constructor(props : any) {
    super(props);

    this.state = {
      date: new Date()
    };
    // TODO udělat podtřídy pro každý typ grafu/tabulky/whatever a tenhle if odstranit
    if (props.chartType == "ExpensesPieChart") {
      this.state.data = [{
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
    }
    else if (props.chartType == "ExpensesBarChart") {
      this.state.data = [
            [{
                "v": 700,
                "name": "1. týden"
            }, {
                "v": 1500,
                "name": "2. týden"
            }, {
                "v": 900,
                "name": "3. týden"
            }, {
                "v": 3000,
                "name": "4. týden"
            }]
        ];
    }
    this.state.date.setDate(1);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(change : number) {
    let newDate = new Date (this.state.date);
    newDate.setMonth(newDate.getMonth() + change);
    this.setState({date: newDate});
  }

  render() {
    return (
      <View style={styles.mainContent}>
        <View style={styles.timeNavigation}>
          <TimeNavigation onDateChange={this.handleDateChange} date={this.state.date} />
        </View>
        <View style={styles.chart}>
          <Chart chartType={this.props.chartType} data={this.state.data}/>
        </View>
        <View style={styles.addTransactionControls}>
          <AddTransactionControls />
        </View>
      </View>
    );
  }
}

function Chart(props : any) {
  if (props.chartType == "ExpensesBarChart") {
    return (
      <ExpensesBarchart data={props.data} />
    );
  }
  else if (props.chartType == "ExpensesPieChart") {
    return (
      <ExpensesPiechart  data={props.data} />
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  timeNavigation: {
    flex: 2
  },
  chart: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  addTransactionControls: {
    flex: 1
  }
});
