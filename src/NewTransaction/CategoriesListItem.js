/* @flow */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Dimensions from 'Dimensions';

const width = Dimensions.get('window').width;

export default class CategoriesListItem extends Component {

  handleCategorySelected() {
    // TODO zavolat callback, který uloží transakci a vrátí se zpět
    // console.log(this.props.categoryKey);
    this.props.onCategorySelected(this.props.categoryKey);
  }

  render() {
    return (
      <TouchableHighlight
        style={styles.item}
        onPress={this.handleCategorySelected.bind(this)}
        underlayColor="steelblue">
        <Text>{this.props.category}</Text>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    height: 50,
    width: (width / 2) - 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5
  }
});
