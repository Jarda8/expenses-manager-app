/* @flow */
import Exponent from 'exponent';
import React from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import MainContentPieChart from './src/MainContentPieChart'
import MainContentBarChart from './src/MainContentBarChart'

class App extends React.Component {
  render() {
  const routes = [
    {title: 'Main Content Pie Chart', index: 0},
    {title: 'Main Content Bar Chart', index: 1},
  ];
    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={(route, navigator) => {
          if (route.index === 0) {
            return <MainContentPieChart
              // onForward={ () => {
              //   navigator.push(routes[1]);
              // }}
            />
          }
          else {
            return <MainContentBarChart
              // onBack={ () => {
              //   navigator.pop();
              // }}
            />
          }
        }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
              {
                if (route.index === 0) {
                  return null;
                } else {
                  return (
                    <TouchableHighlight style={{'height': 50}} onPress={() => navigator.pop()}>
                      <Text>Back</Text>
                    </TouchableHighlight>
                  );
                }
              },
              RightButton: (route, navigator, index, navState) =>{
                if (route.index === 1) {
                  return null;
                } else {
                  return (
                    <TouchableHighlight style={{'height': 50}} onPress={() => navigator.push(routes[index + 1])}>
                      <Text>Next</Text>
                    </TouchableHighlight>
                  );
                }
              },
              Title: (route, navigator, index, navState) =>
              { return (<Text>{route.title}</Text>); },
            }}
            style={{backgroundColor: 'gray'}}
          />
        }
      />
    );
  }
}

Exponent.registerRootComponent(App);
