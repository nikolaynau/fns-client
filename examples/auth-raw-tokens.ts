import * as fns from '..';

// Access token received after login
const sessionId = '<session id>';
// Refresh token received after login
const refreshToken = '<refresh token>';
// Client secret
const clientSecret = '<client secret>';

const auth = new fns.RawTokensAuth({
  accessToken: sessionId,
  refreshToken,
  clientSecret
});
const client = new fns.Client({ auth });

const qr = '<your qr data scanned from the receipt>';
client
  .addReceipt(qr)
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
