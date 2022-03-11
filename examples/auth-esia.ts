import * as fns from '..';

// Client secret
const clientSecret = '<client secret>';

const auth = new fns.OAuth2EsiaAuth({ clientSecret });

// First step: get external ESIA url for auth
auth
  .getEsiaUrl()
  .then((url) => console.log(url))
  .catch((e) => console.error(e));

// Second step: authenticate via esia on the oauth2 flow
const authorizationСode = '<your authorization code>';
const state = '<your verification state>';

// Thrid step: set authorization code and state
auth.setAuthorizationCode(authorizationСode);
auth.setState(state);

const client = new fns.Client({ auth });

const qr = '<your qr data scanned from the receipt>';
client
  .addReceipt(qr)
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
