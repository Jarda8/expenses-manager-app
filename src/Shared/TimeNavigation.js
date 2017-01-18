/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@exponent/vector-icons';

import { periods } from './DataSource';


// TODO typy pro props viz "flow react" na webu *************************************************************************************

// type Props = {
//   title: string,
//   visited: boolean,
//   onClick: () => void,
// };

const months = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];

export default class TimeNavigation extends Component {

  handlePressArrow(change : number) {
      this.props.onDateChange(change);
    }

    renderText() {
      let year = this.props.fromDate.getFullYear();
      let month = months[this.props.fromDate.getMonth()];
      let monthNumber = this.props.fromDate.getMonth() + 1;
      let day = this.props.fromDate.getDate();

      let toYear = this.props.toDate.getFullYear();
      let toMonthNumber = this.props.toDate.getMonth() + 1;
      let toDay = this.props.toDate.getDate();

      if (this.props.period === periods.get('month')) {
        return <Text style={styles.datum}>{month} {year}</Text>;
      } else {
        return <Text style={styles.datum}>{day}.{monthNumber}.{year} - {toDay}.{toMonthNumber}.{toYear}</Text>;
      }
    }

  render() {
    return (
      <View style={styles.timeNavigation}>
        <TouchableHighlight onPress={() => this.handlePressArrow(-1)}>
          <Ionicons name="ios-arrow-back" size={64} color="black" />
        </TouchableHighlight>
        {this.renderText()}
        <TouchableHighlight onPress={() => this.handlePressArrow(1)}>
          <Ionicons name="ios-arrow-forward" size={64} color="black" />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timeNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'bisque'
  },
  datum: {
    fontSize: 20
  }
});
