/* @flow */

import React, { Component } from 'react';
import ReactNative, { View, StyleSheet, Text, TextInput, Alert, Linking } from 'react-native';
import Exponent from 'exponent';

import { saveAccountAsync, updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { csLoginLink, csTokenURI, csTokensRequestBody } from '../Shared/Constants';
import FullWidthButton from '../Shared/FullWidthButton';
import CSAPIClient from '../DataImport/CSAPIClient';


export default class CSTokensForm extends Component {

    static route = {
      navigationBar: {
        title: 'Autentizace'
      }
    }

    componentDidMount() {
      Linking.addEventListener('url', this.handleRedirect);
    }

    componentWillUnmount() {
      Linking.removeEventListener('url', this.handleRedirect);
    }

    login = async () => {
      // console.log('Login link: ' + csLoginLink);
      Exponent.WebBrowser.openBrowserAsync(csLoginLink);
    }

    handleRedirect = async (event) => {
      // console.log(event.url);
      if (!event.url.includes('+/redirect')) {
        // console.log('+/redirect missing');
        return;
      }
      Exponent.WebBrowser.dismissBrowser();
      const [, queryString] = event.url.split('?');
      const responseObj = queryString.split('&').reduce((map, pair) => {
        const [key, value] = pair.split('=');
        map[key] = value;
        return map;
      }, {});
      const code = responseObj.code;
      this.getTokens(code);
    }

    async getTokens(code: string) {
      // console.log("getTokens code: " + code);
      let requestBody = Object.assign({'code': code}, csTokensRequestBody);
      try {
          let response = await fetch(csTokenURI, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body:
          Object.keys(requestBody).map(key =>
            encodeURIComponent(key) + '=' + encodeURIComponent(requestBody[key])
          ).join('&')
        });
        let responseJson = await response.json();
        // console.log("getTokens responseJson:");
        // console.log(responseJson);
        let accessToken = responseJson.token_type + ' ' + responseJson.access_token;
        let refreshToken = responseJson.refresh_token;
        if (this.props.route.params.accountId) {
          this.updateTokens(accessToken, refreshToken);
        } else {
          this.saveNewAccount(accessToken, refreshToken);
        }
      } catch(error) {
        console.log('getTokens error:');
        console.log(error);
      }
    }

    saveNewAccount(accessToken: string, refreshToken: string) {
      // console.log('saveNewAccount accessToken: ' + accessToken + ' refreshToken: ' + refreshToken);
      CSAPIClient.fetchAccount(
        this.props.route.params.accountName,
        this.props.route.params.accountNumber,
        accessToken,
        refreshToken
      ).then(acc => {
        // console.log('saveNewAccount fetchAccount.then acc:');
        // console.log(acc);
        if (acc === null) {
          Alert.alert('Import účtu se nezdařil!', 'Při importu dat z vaší banky došlo k chybě. Zkontrolujte si prosím zadané číslo účtu.');
          this.props.navigator.pop();
        } else {
          acc.connected = true;
          saveAccountAsync(acc);
          this.props.navigator.popToTop();
          console.log('account successfully imported');
        }
      }).catch(() => {
        console.log("saveNewAccount error");
        Alert.alert('Import účtu se nezdařil!', 'Při importu dat z vaší banky došlo k chybě. Opakujte prosím pokus později.');
        this.props.navigator.pop();
      });
    }

    updateTokens(accessToken: string, refreshToken: string) {
      updateAccountByIdAsync(
        this.props.route.params.accountId,
        {accessToken: accessToken, refreshToken: refreshToken}
      );
    }

    render() {
      return (
        <View style={styles.tokensFormView}>
          <View style={{height: 100}}>
            <FullWidthButton text='Přihlásit se k účtu' onPress={this.login.bind(this)} flexSize={1} />
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    tokensFormView: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      justifyContent: 'center'
    }
})
