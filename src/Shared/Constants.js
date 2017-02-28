/* @flow */

export const redirectURI = 'exp://k4-v34.sevcijar.expenses-manager-app.exp.direct/+/redirect';

// CS constants
export const csApiKey = 'f5e8a97d-fc60-42ad-b8ae-466679c6b816'; // only for testing environment
export const csClientId = 'onexmaclient';
export const csClientSecret = 'tfhtoi51gfefsa846ERDsdf57f';
// const csApiDomain = 'https://www.csas.cz'; // production
const csApiDomain =  'https://www.csast.csas.cz'; // test
// const csApiDomain =  'https://api.csas.cz/sandbox'; // sandbox
export const csLoginLink =
csApiDomain + '/widp/oauth2/auth?state=profil&redirect_uri=' + redirectURI
+ '&client_id=' + csClientId + '&response_type=code&access_type=offline';
export const csProfileURI = csApiDomain + '/webapi/api/v3/netbanking/my/profile';
export const csAccountsURI = csApiDomain + '/webapi/api/v3/netbanking/my/accounts';
export const csTokenURI = csApiDomain + '/widp/oauth2/token';
export const csTokensRequestBody = {
  'client_id': csClientId,
  'cleint_secret': csClientSecret,
  'redirect_uri': redirectURI,
  'grant_type': 'authorization_code'
};
