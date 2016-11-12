/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@exponent/vector-icons';


// TODO typy pro props viz "flow react" na webu *************************************************************************************

// type Props = {
//   title: string,
//   visited: boolean,
//   onClick: () => void,
// };

export class TimeNavigation extends Component {

  // declare props (default props a tak)

  handlePressArrow(change : number) {
      console.log("You tapped " + change + "!");
      this.props.onDateChange(change);
    }

  render() {
    let year = this.props.date.getFullYear();
    let month = months[this.props.date.getMonth()];

    return (
      <View style={styles.timeNavigation}>
        <TouchableHighlight onPress={() => this.handlePressArrow(-1)}>
          <Ionicons name="ios-arrow-back" size={32} color="black" />
        </TouchableHighlight>
        <Text>{month} {year}</Text>
        <TouchableHighlight onPress={() => this.handlePressArrow(1)}>
          <Ionicons name="ios-arrow-forward" size={32} color="black" />
        </TouchableHighlight>
      </View>
    );
  }
}

const months = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];

const styles = StyleSheet.create({
  timeNavigation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
