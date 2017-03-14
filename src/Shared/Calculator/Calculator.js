/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Ionicons } from '@exponent/vector-icons';

import NumberKey from './NumberKey';
import OperatorKey from './OperatorKey';
import IconKey from './IconKey';

const maxInputLength = 11;

export default class Calculator extends Component {

    static route = {
      navigationBar: {
        title: 'Calculator Test'
      },
    }

  constructor(props: any) {
    super(props);
    this.state = {
      result: props.initialNumber,
      operator: '',
      clearDisplay: false,
      display: '' + props.initialNumber
    };
    this.handleNumber = this.handleNumber.bind(this);
    this.handleOperation = this.handleOperation.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleFloatingPoint = this.handleFloatingPoint.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleBackspace = this.handleBackspace.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.handleConfirmButtonPressed = this.handleConfirmButtonPressed.bind(this);
  }

  updateDisplay(toDisplay: string) {
    this.setState({display: toDisplay});
    this.props.onDisplayChange(toDisplay);
  }

  handleConfirmButtonPressed() {
    let result: number = this.handleEquals();
    this.props.onConfirmButtonPressed(result);
  }

  handleNumber(number : number) {
    let display = this.state.display;
    if (this.state.clearDisplay || display === '0') {
      display = '';
      this.setState({clearDisplay: false});
    }
    let [wholePart, fractionalPart] = display.split(".");
    if (wholePart.length < maxInputLength
      || (fractionalPart && fractionalPart.length < 2) || fractionalPart === '') {
      this.updateDisplay(display + number);
    }
  }

  handleFloatingPoint() {
    if (this.state.clearDisplay) {
      this.setState({clearDisplay: false});
      this.updateDisplay('0.');
    } else if (this.state.display.indexOf('.') === -1) {
      this.updateDisplay(this.state.display + '.');
    }
  }

  handleOperation(operator: string) {
    if (this.state.operator !== '') {
      this.handleEquals();
    } else {
      this.setState({result: parseFloat(this.state.display)});
    }
    this.setState(
      {operator: operator, clearDisplay: true});
  }

  setResultState(result: number) {
    var textResult = '' + result;
    if (textResult.indexOf('.') !== -1) {
      textResult = result.toFixed(2);
    }
    this.setState({result: result, operator: '', clearDisplay: false});
    this.updateDisplay(textResult);
  }

  handleEquals(): number {
    var result;
    let secondOperand = parseFloat(this.state.display);
    if (this.state.operator === '') {
      return secondOperand;
    } else if (this.state.operator === '+') {
      result = this.state.result + secondOperand;
    } else if (this.state.operator === '-') {
      result = this.state.result - secondOperand;
    } else if (this.state.operator === '*') {
      result = this.state.result * secondOperand;
    } else if (this.state.operator === '÷') {
      if (secondOperand !== 0) {
        result = this.state.result / secondOperand;
      } else {
        result = this.state.result;
      }
    }
    result = Math.round(result * 100) / 100;
    let resultString = '' + result;
    let [wholePart,] = resultString.split(".");
    if (wholePart.length > maxInputLength) {
      result = 0;
    }
    this.setResultState(result);
    return result;
  }

  handleClearAll() {
    this.setState(
      {
      result: 0,
      operator: '',
      clearDisplay: false
    });
    this.updateDisplay('0');
  }

  handleBackspace() {
    let displayText = this.state.display;
    if (displayText === '0') {
      return;
    } else if (displayText.length === 1) {
      this.updateDisplay('0');
    } else {
      let newDisplay = this.state.display.substring(0, this.state.display.length - 1);
      this.updateDisplay(newDisplay);
    }
  }

  render() {
    return (
      <View style={styles.calculator}>
        {/* <View style={styles.display}>
          <Text>{this.state.display}</Text>
        </View> */}
        {/* <View style={styles.keyboard}> */}
        <View style={styles.keyRow}>
          <OperatorKey symbol='CA' onKeyPress={this.handleClearAll} />
          <IconKey onKeyPress={this.handleBackspace}>
            <Ionicons name='md-backspace' size={32} color='black' />
          </IconKey>
        </View>
        <View style={styles.keyRow}>
          <NumberKey number={1} onKeyPress={this.handleNumber} />
          <NumberKey number={2} onKeyPress={this.handleNumber} />
          <NumberKey number={3} onKeyPress={this.handleNumber} />
          <OperatorKey symbol='÷' onKeyPress={() => this.handleOperation('÷')} />
        </View>
        <View style={styles.keyRow}>
          <NumberKey number={4} onKeyPress={this.handleNumber} />
          <NumberKey number={5} onKeyPress={this.handleNumber} />
          <NumberKey number={6} onKeyPress={this.handleNumber} />
          <OperatorKey symbol='*' onKeyPress={() => this.handleOperation('*')} />
        </View>
        <View style={styles.keyRow}>
          <NumberKey number={7} onKeyPress={this.handleNumber} />
          <NumberKey number={8} onKeyPress={this.handleNumber} />
          <NumberKey number={9} onKeyPress={this.handleNumber} />
          <OperatorKey symbol='-' onKeyPress={() => this.handleOperation('-')} />
        </View>
        <View style={styles.keyRow}>
          <OperatorKey symbol=',' onKeyPress={this.handleFloatingPoint} />
          <NumberKey number={0} onKeyPress={this.handleNumber} />
          <OperatorKey symbol='=' onKeyPress={this.handleEquals} />
          <OperatorKey symbol='+' onKeyPress={() => this.handleOperation('+')} />
        </View>
        <View style={styles.keyRow}>
          <TouchableHighlight
            onPress={() => this.handleConfirmButtonPressed()}
            underlayColor= 'steelblue'
            style={styles.confirmButton}>
            <Text style={styles.buttonText}>{this.props.confirmButtonText}</Text>
          </TouchableHighlight>
        </View>
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calculator: {
    flex: 1
  },
  // display: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'powderblue'
  // },
  keyRow: {
    flex: 1,
    flexDirection: 'row'
  },
  confirmButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 1,
    backgroundColor: 'steelblue'
  },
  buttonText: {
    fontSize: 30
  }
  // keyboard: {
  //   flex: 1
  // }
});
