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
import { Foundation, MaterialIcons } from '@exponent/vector-icons';

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
    if (name === "account-balance-wallet" || name === "assignment-late") {
      return (
        <MaterialIcons
          style={[styles.icon, isSelected ? styles.selectedText : null, extraStyle]}
          name={name}
          size={24}
        />
      )
    }
    else {
      return (
        <Foundation
          style={[styles.icon, isSelected ? styles.selectedText : null, extraStyle]}
          name={name}
          size={24}
        />
      );
    }
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
          renderTitle={isSelected => this._renderTitle('Výdaje', isSelected)}
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
          renderTitle={isSelected => this._renderTitle('Výdaje v čase', isSelected)}
          renderIcon={isSelected => this._renderIcon('graph-bar', isSelected)}>
          <StackNavigation
            id="barChart"
            initialRoute={Router.getRoute('barChart')}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="transactionsItem"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Transakce', isSelected)}
          renderIcon={isSelected => this._renderIcon('list', isSelected)}>
          <StackNavigation
            id="transactions"
            initialRoute={Router.getRoute('transactions')}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="accountsItem"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Účty', isSelected)}
          renderIcon={isSelected => this._renderIcon('account-balance-wallet', isSelected)}>
          <StackNavigation
            id="accounts"
            initialRoute={Router.getRoute('accounts')}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="budgetsItem"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Limity', isSelected)}
          renderIcon={isSelected => this._renderIcon('assignment-late', isSelected)}>
          <StackNavigation
            id="budgets"
            initialRoute={Router.getRoute('budgets')}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="calculatorItem"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Calculator Test', isSelected)}
          renderIcon={isSelected => this._renderIcon('layout', isSelected)}>
          <StackNavigation
            id="calculator"
            initialRoute={Router.getRoute('calculator')}
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
