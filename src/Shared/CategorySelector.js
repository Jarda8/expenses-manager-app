/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker } from 'react-native';

import { ExpensesCategories, All } from './Categories';


// TODO typy pro props viz "flow react" na webu *************************************************************************************

// type Props = {
//   title: string,
//   visited: boolean,
//   onClick: () => void,
// };

export default class CategorySelector extends Component {

  // declare props (default props a tak)

  handleCategorySelect(category: string) {
    this.props.onCategoryChange(category);
  }

  generateCategories() {
    var items = Object.keys(ExpensesCategories).map(
      (category) => <Picker.Item key={category} label={ExpensesCategories[category]} value={category} />
    )
    items.unshift(<Picker.Item key={All} label={All} value={All} />);
    return items;
  }

  render() {

    return (
      <View style={[styles.pickerView, this.props.style]}>
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
    // backgroundColor: 'aquamarine',
    justifyContent: 'center'
  },
  picker: {
    width: 160,
    // backgroundColor: 'white'
  }
});
