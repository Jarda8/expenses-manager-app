/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Picker } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation'

import Calculator from '../Shared/Calculator/Calculator';
import { getBudgets, deleteBudget } from '../Shared/DataSource';
import { ExpensesCategories } from '../Shared/Categories';
import { Router } from '../../main';
import BudgetModificator from './BudgetModificator';

@withNavigation
export default class BudgetForm extends Component {

  constructor(props : any) {
    super(props);
    if (props.budget === undefined) {
      this.state = {
        category: this.getFreeCategories()[0],
        budget: 0,
        notificationThreshold: 0.8,
        displayedNumber: '0'
      };
    } else {
      this.state = {
        category: props.budget.category,
        budget: props.budget.budget,
        notificationThreshold: props.budget.notificationThreshold,
        displayedNumber: '' + props.budget.budget
      };
    }
  }

  getFreeCategories() {
    let allCategories = Object.keys(ExpensesCategories);
    let occupiedCategories = getBudgets().map(
      (budget) => budget.category
    );
    let freeCategories = allCategories.filter(
      (category) => !occupiedCategories.includes(category)
    );
    return freeCategories;
  }

  saveNewBudget(budget: number) {
    // saveBudget({
    //   category: this.state.category,
    //   budget: budget,
    //   notificationThreshold: this.state.notificationThreshold
    // });
    BudgetModificator.saveBudget({
      category: this.state.category,
      budget: budget,
      notificationThreshold: this.state.notificationThreshold
    });
    this.props.navigator.pop();
  }

  updateOldBudget(budget: number) {
    // updateBudget(
    //   this.props.budget,
    //   {
    //     category: this.state.category,
    //     budget: budget,
    //     notificationThreshold: this.state.notificationThreshold
    //   }
    // );
    BudgetModificator.updateBudget(
      this.props.budget,
      {
        category: this.state.category,
        budget: budget,
        notificationThreshold: this.state.notificationThreshold
      }
    );
    this.props.navigator.pop();
  }

  handleOnPress() {
    if (this.props.budget === undefined) {
      this.saveNewBudget();
    } else {
      this.updateOldBudget();
    }
  }

  handleDisplayChange(toDisplay: string) {
    this.setState({displayedNumber: toDisplay});
  }

  handleConfirmButtonPressed(budget : number) {
    // TODO blokovat záporný result -> upozornit uživatele a jinak nic
    if (this.props.budget === undefined) {
      this.saveNewBudget(budget);
    } else {
      this.updateOldBudget(budget);
    }
  }

  generateCategoriesItems() {
    let freeCategories = this.getFreeCategories();
    if (this.props.budget !== undefined) {
      freeCategories.push(this.props.budget.category);
    }
    return freeCategories.map(
      (category) => <Picker.Item key={category} label={ExpensesCategories[category]} value={category} />
    );
  }

  generateThresholdItems() {
    let items = [];
    for (var i = 25; i <= 100; i+= 5) {
      items.push(
        <Picker.Item key={i} label={'' + i} value={i} />
      );
    }
    return items;
  }

  render() {
    return (
      <View style={styles.budgetForm}>
        <View style={styles.formItem}>
          <Text style={styles.label}>Kategorie: </Text>
          <Picker
            style={styles.pickerInput}
            selectedValue={this.state.category}
            onValueChange={(newCategory) => this.setState({category: newCategory})}>
            {this.generateCategoriesItems()}
          </Picker>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Měsíční limit: </Text>
          <View style={styles.numberDisplay}>
            <Text style={styles.numberInput}>{this.state.displayedNumber}</Text>
            {/* TODO lokalizovat měnu */}
            <Text style={styles.currency}>CZK</Text>
          </View>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.thresholdLabel}>Upozornit při překročení </Text>
          <Picker
            style={styles.notificationThresholdPicker}
            selectedValue={this.state.notificationThreshold * 100}
            onValueChange={(newThreshold) => this.setState({notificationThreshold: newThreshold / 100})}>
            {this.generateThresholdItems()}
          </Picker>
          <Text style={styles.currency}>%</Text>
        </View>
        <View style={styles.calculatorView}>
          <Calculator
            initialNumber={this.state.budget}
            onDisplayChange={this.handleDisplayChange.bind(this)}
            onConfirmButtonPressed={this.handleConfirmButtonPressed.bind(this)}
            confirmButtonText='Uložit'  />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  budgetForm: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    margin: 10
  },
  calculatorView: {
    flex: 5
  },
  formItem: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  label: {
    fontSize: 20,
    width: 80
  },
  thresholdLabel: {
    fontSize: 20,
    width: 250
  },
  pickerInput: {
    width: 250
  },
  notificationThresholdPicker: {
    width: 80
  },
  currency: {
    fontSize: 25,
    marginLeft: 10
  },
  textInput: {
    // flex: 4,
    width: 250,
    fontSize: 25
  },
  numberDisplay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  numberInput: {
    fontSize: 25
  }
});
