import * as fns from '..';

// Your phone number
const phone = '<your password>';
// Catcha key
const catcha = '<your captcha key>';
// Client secret
const clientSecret = '<client secret>';

const auth = new fns.TwoFactorAuth({ phone, clientSecret });

// First step: call signIn to receive a verification code for a phone number
auth.signIn(catcha).catch((e) => console.error(e));

// Second step: set verification code
const code = '<your verification code received by sms>';
auth.setVerificationCode(code);

const client = new fns.Client({ auth });

const qr = '<your qr data scanned from the receipt>';
client
  .addReceipt(qr)
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
