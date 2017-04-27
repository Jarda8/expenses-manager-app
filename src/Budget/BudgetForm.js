/* @flow */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Picker } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';
import TMPicker from '../../modifiedLibraries/react-native-picker-xg/app/picker';

import Calculator from '../Shared/Calculator/Calculator';
import { getBudgetsAsync } from '../DataSources/BudgetsDS';
import { ExpensesCategories } from '../Shared/Categories';
import { Router } from '../../main';
import BudgetModificator from './BudgetModificator';

@withNavigation
export default class BudgetForm extends Component {

  constructor(props : any) {
    super(props);
    if (props.budget === undefined) {
      this.state = {
        freeCategories: [],
        category: '',
        budget: 0,
        notificationThreshold: 0.8,
        displayedNumber: '0'
      };
    } else {
      this.state = {
        freeCategories: [],
        category: props.budget.category,
        budget: props.budget.budget,
        notificationThreshold: props.budget.notificationThreshold,
        displayedNumber: '' + props.budget.budget
      };
    }
  }

  componentWillMount() {
    this.getFreeCategories();
  }

  getFreeCategories() {
    let allCategories = Object.keys(ExpensesCategories);
    getBudgetsAsync(result => {
      let occupiedCategories = result.map(budget => budget.category);
      let freeCategories = allCategories.filter(
        category => !occupiedCategories.includes(category)
      );
      if (this.props.budget !== undefined) {
        freeCategories.push(this.props.budget.category);
        this.setState({freeCategories: freeCategories});
      } else {
        this.setState({freeCategories: freeCategories, category: freeCategories[0]});
      }
    });
  }

  saveNewBudget(budget: number) {
    BudgetModificator.saveBudget({
      category: this.state.category,
      budget: budget,
      notificationThreshold: this.state.notificationThreshold
    });
    this.props.navigator.pop();
  }

  updateOldBudget(budget: number) {
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
    let items = [{}];
    for (category of this.state.freeCategories) {
      items[0][category] = {name: ExpensesCategories[category]};
    }
    return items;
  }

  handleCategorySelect(category: string) {
    for (categoryKey of Object.keys(ExpensesCategories)) {
      if (ExpensesCategories[categoryKey] === category) {
        this.setState({category: categoryKey});
        return;
      }
    }
  }

  renderCategoryPicker() {
    if (this.state.category !== '') {
      return (
        <TMPicker
          inputValue ={ExpensesCategories[this.state.category]}
          inputStyle = {styles.pickerInput}
          confirmBtnText = {'potvrdit'}
          cancelBtnText = {'zrušit'}
          data = {this.generateCategoriesItems()}
          onResult ={this.handleCategorySelect.bind(this)}
          visible = {false}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.budgetForm}>
        <View style={styles.formItem}>
          <Text style={styles.label}>Kategorie: </Text>
          {this.renderCategoryPicker()}
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Měsíční limit: </Text>
          <View style={styles.numberDisplay}>
            <Text style={styles.numberInput}>{this.state.displayedNumber}</Text>
            <Text style={styles.currency}>CZK</Text>
          </View>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Upozornit při překročení </Text>
          <TMPicker
            inputValue={this.state.notificationThreshold * 100 + ' %'}
            inputStyle={styles.pickerInput}
            confirmBtnText={'potvrdit'}
            cancelBtnText={'zrušit'}
            data={tresholdPickerData}
            onResult={(newThreshold) => this.setState({notificationThreshold: parseInt(newThreshold) / 100})}
            visible={false}
          />
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

const tresholdPickerData = (() => {
  let items = [{}];
  for (var i = 25; i <= 100; i+= 5) {
    items[0][i + ''] = {name: i + ' %'};
  }
  return items;
})()

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  label: {
    fontSize: 20,
    width: 130
  },
  pickerInput: {
    width: 170
  },
  currency: {
    fontSize: 25,
    marginLeft: 10
  },
  numberDisplay: {
    width: 180,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  numberInput: {
    fontSize: 25
  }
});
