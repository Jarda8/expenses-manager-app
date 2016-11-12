/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { TimeNavigation } from './TimeNavigation'
import { AddTransactionControls } from './AddTransactionControls'

export default class MainContent extends Component {

  constructor(props : any) {
    super(props);
    this.state = {
      date: new Date()
    };
    this.state.date.setDate(1);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(change : number) {
    let newDate = new Date (this.state.date);
    newDate.setMonth(newDate.getMonth() + change);
    this.setState({date: newDate});
  }

  renderChart() {
    return React.Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          date: this.state.date
        })
    })
  }

  render() {
    return (
      <View style={styles.mainContent}>
        <View style={styles.timeNavigation}>
          <TimeNavigation onDateChange={this.handleDateChange} date={this.state.date} />
        </View>
        <View style={styles.chart}>
          {this.renderChart()}
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
