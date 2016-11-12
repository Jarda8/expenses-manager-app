/* @flow */
import Exponent from 'exponent';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { createRouter, NavigationProvider, } from '@exponent/ex-navigation';

import DrawerNavigationPanel from './src/DrawerNavigationPanel'
import MainContentPieChart from './src/MainContentPieChart'
import MainContentBarChart from './src/MainContentBarChart'

export const Router = createRouter(() => ({
  pieChart: () => MainContentPieChart,
  barChart: () => MainContentBarChart
}));

class App extends Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StatusBar barStyle="light-content" />
        <DrawerNavigationPanel />
      </NavigationProvider>
    );
  }
}

Exponent.registerRootComponent(App);
