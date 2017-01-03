/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Calculator from './Shared/Calculator/Calculator';


export default class CalculatorView extends Component {

  constructor(props : any) {
    super(props);
    this.state = {
      display: '0'
    };
    this.handleResultChange = this.handleResultChange.bind(this);
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
  }

  handleResultChange(newResult : number) {
    this.setState({result: newResult});
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({display: toDisplay});
  }

  render() {
    return (
      <View style={styles.calculatorView}>
        <View style={styles.display}>
          <Text>{this.state.display}</Text>
        </View>
        <Calculator
          onDisplayChange={this.handleDisplayChange}
          onResultChange={this.handleResultChange} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calculatorView: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  display: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'powderblue'
  }
});
