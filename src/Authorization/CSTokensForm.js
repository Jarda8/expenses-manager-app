/* @flow */

import React, { Component } from 'react';
import ReactNative, { View, StyleSheet, Text, TextInput, Alert, Linking } from 'react-native';
import Exponent from 'exponent';

import { saveAccountAsync, updateAccountByIdAsync } from '../DataSources/AccountsDS';
import { csLoginLink, csTokenURI, csTokensRequestBody } from '../Shared/Constants';
import FullWidthButton from '../Shared/FullWidthButton';


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
      console.log('Login link: ' + csLoginLink);
      Exponent.WebBrowser.openBrowserAsync(csLoginLink);
    }

    handleRedirect = async (event) => {
      console.log(event.url);
      if (!event.url.includes('+/redirect')) {
        return;
      }
      Exponent.WebBrowser.dismissBrowser();
      const [, queryString] = event.url.split('#');
      const responseObj = queryString.split('&').reduce((map, pair) => {
        const [key, value] = pair.split('=');
        map[key] = value;
        return map;
      }, {});
      const code = responseObj.code;
      this.getTokens(code);
    }

    async getTokens(code: string) {
      console.log("code: " + code);
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
        console.log("responseJson: " + responseJson);
        let accessToken = responseJson.token_type + ' ' + responseJson.access_token;
        let refreshToken = responseJson.refresh_token;
        if (this.props.route.params.accountId) {
          updateTokens(accessToken, refreshToken);
        } else {
          saveNewAccount(accessToken, refreshToken);
        }
      } catch(error) {
        console.log('getTokens error:');
        console.log(error);
      }
    }

    saveNewAccount(accessToken: string, refreshToken: string) {
      console.log('accessToken: ' + accessToken + ' refreshToken: ' + refreshToken);
      CSAPIClient.fetchAccount(
        this.props.route.params.accountName,
        this.props.route.params.accountNumber,
        accessToken,
        refreshToken
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

    updateTokens(accessToken: string, refreshToken: string) {
      updateAccountByIdAsync(
        this.props.route.params.accountId,
        {accessToken: accessToken, refreshToken: refreshToken}
      );
    }

    render() {
      return (
        <View style={styles.tokensFormView}>
          {/* <View style={styles.tokensForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Následující odkaz vede na přihlašovací stránku České Spořitelny. Po přihlášení získáte tokeny nutné pro přístup aplikace k historii transakcí na vašem účtu.</Text>
              <Text style={styles.link}
                onPress={() => Linking.openURL(csLoginLink)}>
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
          </View> */}
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
      justifyContent: 'center',
      // alignItems: 'center'
    },
    // tokensForm: {
    //   flex: 7,
    //   justifyContent: 'center',
    //   alignItems: 'center'
    // },
    // formGroup: {
    //   alignItems: 'center',
    //   marginBottom: 50,
    //   marginLeft: 20,
    //   marginRight: 20
    // },
    // label: {
    //   textAlign: 'center',
    //   marginBottom: 10
    // },
    // link: {
    //   color: 'blue'
    // }
})
