/* @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker } from 'react-native';
import TMPicker from 'react-native-picker-xg';

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
        {/* <Picker
          style={styles.picker}
          selectedValue={this.props.category}
          onValueChange={this.handleCategorySelect.bind(this)}>
          {this.generateCategories()}
        </Picker> */}
        <TMPicker
          inputValue ={this.props.category}
          inputStyle = {styles.picker}
          confirmBtnText = {'potvrdit'}
          cancelBtnText = {'zrušit'}
          data = {pickerData}
          // selectIndex = {[0,1]}
          onResult ={this.handleCategorySelect.bind(this)}
          visible = {false}
        />
      </View>
    );
  }
}

const pickerData = (() => {
  // var items = Object.keys(ExpensesCategories).map(
  //   (category) => <Picker.Item key={category} label={ExpensesCategories[category]} value={category} />
  // )
  // items.unshift(<Picker.Item key={All} label={All} value={All} />);
  // return items;
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
    // backgroundColor: 'aquamarine',
    justifyContent: 'center'
  },
  picker: {
    width: 160,
    // backgroundColor: 'white'
  }
});
