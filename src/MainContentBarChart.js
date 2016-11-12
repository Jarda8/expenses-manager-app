/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { MainContent } from './MainContent'
import { ExpensesBarchart } from './ExpensesBarchart'
import { TimeNavigation } from './TimeNavigation'
import { AddTransactionControls } from './AddTransactionControls'

export default class MainContentPieChart extends Component {

  constructor(props : any) {
    super(props);

    this.state = {
      date: new Date()
    };

    // TODO udělat podtřídy pro každý typ grafu/tabulky/whatever a tenhle if odstranit
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
          <ExpensesBarchart data={this.state.data}/>
        </View>
        <View style={styles.addTransactionControls}>
          <AddTransactionControls />
        </View>
      </View>
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
