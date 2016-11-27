/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker } from 'react-native';

import { ExpensesCategories } from './Categories';


// TODO typy pro props viz "flow react" na webu *************************************************************************************

// type Props = {
//   title: string,
//   visited: boolean,
//   onClick: () => void,
// };

export default class CategorySelector extends Component {

  // declare props (default props a tak)

  handleCategorySelect(category: string) {
    console.log("category: " + category);
    this.props.onCategoryChange(category);
  }

  generateCategories() {
    return Object.keys(ExpensesCategories).map(
      (category) => <Picker.Item key={category} label={ExpensesCategories[category]} value={ExpensesCategories[category]} />
    )
  }

  render() {

    return (
      <View style={styles.pickerView}>
        <Text>Kategorie:</Text>
        <Picker
          style={styles.picker}
          selectedValue={this.props.category}
          onValueChange={this.handleCategorySelect.bind(this)}>
          {this.generateCategories()}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'aquamarine'
  },
  picker: {
    width: 160,
    // backgroundColor: 'white'
  }
});
