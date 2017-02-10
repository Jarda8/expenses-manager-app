/* @flow */

// CSAS constants
export const apiKey = 'f5e8a97d-fc60-42ad-b8ae-466679c6b816'; // only for testing environment
export const redirectUri = 'http://localhost:8081/get-tokens'; // TODO: upravit, až bude server na Heroku
export const clientId = '';
export const clientSecret = '';
// const apiDomain = 'https://www.csas.cz'; // production
const apiDomain =  'https://www.csast.csas.cz'; // test
// const apiDomain =  'https://api.csas.cz/sandbox'; // sandbox
export const loginLink =
apiDomain + '/widp/oauth2/auth?state=profil&redirect_uri=' + redirectUri
+ '&client_id=' + clientId + '&response_type=code&access_type=offline';
export const profileURI = apiDomain + '/webapi/api/v3/netbanking/my/profile';
export const accountsURI = apiDomain + '/webapi/api/v3/netbanking/my/accounts';
export const tokenURI = apiDomain + '/widp/oauth2/token';
