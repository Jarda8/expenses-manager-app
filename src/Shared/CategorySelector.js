/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker } from 'react-native';
import TMPicker from '../../modifiedLibraries/react-native-picker-xg/app/picker';

import { ExpensesCategories, All } from './Categories';

export default class CategorySelector extends Component {

  handleCategorySelect(category: string) {
    if (category === All) {
      this.props.onCategoryChange(All);
      return;
    };
    for (categoryKey of Object.keys(ExpensesCategories)) {
      if (ExpensesCategories[categoryKey] === category) {
        this.props.onCategoryChange(categoryKey);
        return;
      }
    }
  }

  render() {

    return (
      <View style={[styles.pickerView, this.props.style]}>
        <Text>Kategorie:</Text>
        <TMPicker
          inputValue ={this.props.category}
          inputStyle = {styles.picker}
          confirmBtnText = {'potvrdit'}
          cancelBtnText = {'zrušit'}
          data = {pickerData}
          onResult ={this.handleCategorySelect.bind(this)}
          visible = {false}
        />
      </View>
    );
  }
}

const pickerData = (() => {
  var items = [{}];
  items[0][All] = {name: All};
  for (category of Object.keys(ExpensesCategories)) {
    items[0][category] = {name: ExpensesCategories[category]};
  }
  return items;
})();

const styles = StyleSheet.create({
  pickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picker: {
    width: 160
  }
});
