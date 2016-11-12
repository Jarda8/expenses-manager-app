/* @flow */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pie } from 'react-native-pathjs-charts'

export class ExpensesPiechart extends Component {
    render() {

      var options = {
          margin: {
              top: 20,
              left: 20,
              right: 20,
              bottom: 20
          },
          width: 300,
          height: 300,
          color: '#2980B9',
          r: 50,
          R: 100,
          legendPosition: 'topLeft',
          animate: {
              type: 'oneByOne',
              duration: 200,
              fillTransition: 3
          },
          label: {
              fontFamily: 'Arial',
              fontSize: 12,
              fontWeight: true,
              color: '#000'
          }
      }

        return (
          <View style={{flex:1,backgroundColor:'#F5FCFF'}}
            contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
            <Pie
              data={this.props.data}
              options={options}
              accessorKey="population" />
          </View>
        );
    }
}
