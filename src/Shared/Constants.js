/* @flow */

export const redirectURI = 'exp://k4-v34.sevcijar.expenses-manager-app.exp.direct/+/redirect';
// export const redirectURI = 'exp://k4-v34.sevcijar.expenses-manager-app.exp.direct:80';

// CS constants
export const csApiKey = 'f5e8a97d-fc60-42ad-b8ae-466679c6b816'; // only for testing environment
export const csClientId = 'onexmaclient';
export const csClientSecret = 'tfhtoi51gfefsa846ERDsdf57f';
// const csApiDomain = 'https://www.csas.cz'; // production
const csApiDomain =  'https://www.csast.csas.cz'; // test
// const csApiDomain =  'https://api.csas.cz/sandbox'; // sandbox
export const csLoginLink =
csApiDomain + '/widp/oauth2/auth?state=profil&redirect_uri=' + encodeURIComponent(redirectURI)
+ '&client_id=' + encodeURIComponent(csClientId) + '&response_type=code&access_type=offline&approval_prompt=force';
export const csProfileURI = csApiDomain + '/webapi/api/v3/netbanking/my/profile';
export const csAccountsURI = csApiDomain + '/webapi/api/v3/netbanking/my/accounts';
export const csTransactionsURI = csApiDomain + '/webapi/api/v3/netbanking/cz/my/accounts';
export const csTokenURI = csApiDomain + '/widp/oauth2/token';
export const csTokensRequestBody = {
  'client_id': encodeURIComponent(csClientId),
  'client_secret': encodeURIComponent(csClientSecret),
  'redirect_uri': encodeURIComponent(redirectURI),
  'grant_type': 'authorization_code'
};

// export const categorizeURI = 'http://10.0.3.2:8081/';
export const categorizeURI = 'https://sleepy-scrubland-37283.herokuapp.com/';
// export const addCategorizationURI = 'http://10.0.3.2:8081/new-categorized-transaction';
export const addCategorizationURI = 'https://sleepy-scrubland-37283.herokuapp.com/new-categorized-transaction';
