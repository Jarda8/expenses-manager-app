/* @flow */

import React, { Component } from 'react';
import ReactNative, { View, StyleSheet, Text, TextInput, Alert, Linking } from 'react-native';

import { saveAccountAsync, updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { loginLink } from '../Shared/Constants';
import FullWidthButton from '../Shared/FullWidthButton';


export default class CSASTokensForm extends Component {

    static route = {
      navigationBar: {
        title: 'Autorizace'
      }
    }

    constructor(props: any) {
      super(props);
      this.accessToken = null;
      this.refreshToken = null;
    }

    saveNewAccount() {
      CSAPIClient.fetchAccount(
        this.props.route.params.accountName,
        this.props.route.params.accountNumber,
        this.accessToken,
        this.refreshToken
      ).then(acc => {
        if (acc === null) {
          Alert.alert('Import účtu se nezdařil!', 'Při importu dat z vaší banky došlo k chybě. Zkontrolujte si prosím zadané číslo účtu.');
        } else {
          acc.connected = true;
          saveAccountAsync(acc);
          this.props.navigator.popToTop();
        }
      }).catch(() => console.log("saveNewAccount() promise rejected"));
    }

    updateTokens() {
      updateAccountByIdAsync(
        this.props.route.params.accountId,
        {accessToken: this.accessToken, refreshToken: this.refreshToken}
      );
    }

    handleOnPress() {
      if (this.props.route.params.accountId === undefined) {
        this.saveNewAccount();
      } else {
        this.updateTokens();
      }
    }

    render() {
      return (
        <View style={styles.tokensFormView}>
          <View style={styles.tokensForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Následující odkaz vede na přihlašovací stránku České Spořitelny. Po přihlášení získáte tokeny nutné pro přístup aplikace k historii transakcí na vašem účtu.</Text>
              <Text style={styles.link}
                onPress={() => Linking.openURL(loginLink)}>
                Přihlásit se
              </Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Autorizační token:</Text>
              <TextInput
                // style={styles.textInput}
                onChangeText={(text) => this.accessToken = text} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Refresh token:</Text>
              <TextInput
                // style={styles.textInput}
                onChangeText={(text) => this.refreshToken = text} />
            </View>
          </View>
          <FullWidthButton text='Potvrdit' onPress={this.handleOnPress.bind(this)} flexSize={1} />
        </View>
      );
    }
}

const styles = StyleSheet.create({
    tokensFormView: {
      flex: 1,
      backgroundColor: '#F5FCFF'
    },
    tokensForm: {
      flex: 7,
      justifyContent: 'center',
      alignItems: 'center'
    },
    formGroup: {
      alignItems: 'center',
      marginBottom: 50,
      marginLeft: 20,
      marginRight: 20
    },
    label: {
      textAlign: 'center',
      marginBottom: 10
    },
    link: {
      color: 'blue'
    }
})
