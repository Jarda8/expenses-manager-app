import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
  // Image
} from 'react-native';
import {
  StackNavigation,
  DrawerNavigation,
  DrawerNavigationItem,
} from '@exponent/ex-navigation';
import { Foundation } from '@exponent/vector-icons';

import { Router } from '../main';

export default class DrawerNavigationPanel extends Component {

  _renderHeader = () => {
    return <View style={styles.header} />;
  };

  _renderTitle = (text: string, isSelected: bool) => {
    return (
      <Text style={[styles.buttonTitleText, isSelected ? styles.selectedText : null]}>
        {text}
      </Text>
    );
  };

  _renderIcon = (name: string, isSelected: bool) => {
    let extraStyle = {marginTop: 2};
    return (
      <Foundation
        style={[styles.icon, isSelected ? styles.selectedText : null, extraStyle]}
        name={name}
        size={24}
      />
    );
  };

  render() {
    return (
      <DrawerNavigation
        drawerPosition="left"
        renderHeader={this._renderHeader}
        drawerWidth={300}
        initialItem="pieChartItem">
        <DrawerNavigationItem
          id="pieChartItem"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Expenses Pie Chart', isSelected)}
          renderIcon={isSelected => this._renderIcon('graph-pie', isSelected)}>
          <StackNavigation
            id="pieChart"
            // defaultRouteConfig={{
            //   navigationBar: {
            //     backgroundColor: '#0084FF',
            //     tintColor: '#fff',
            //   },
            // }}
            initialRoute={Router.getRoute('pieChart')}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="barChartItem"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Expenses Bar Chart', isSelected)}
          renderIcon={isSelected => this._renderIcon('graph-bar', isSelected)}>
          <StackNavigation
            id="barChart"
            initialRoute={Router.getRoute('barChart')}
          />
        </DrawerNavigationItem>
      </DrawerNavigation>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: 180
    // width: null,
    // resizeMode: 'cover',
  },
  buttonTitleText: {
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 18,
  },
  icon: {
    color: '#999',
  },
  selectedText: {
    color: '#0084FF',
  },
  selectedItemStyle: {
    backgroundColor: "#E8E8E8",
  },
});
