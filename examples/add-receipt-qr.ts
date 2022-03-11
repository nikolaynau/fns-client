import * as fns from '..';

// Your INN from https://lkfl2.nalog.ru
const inn = '<your inn>';
// Your password from https://lkfl2.nalog.ru
const password = '<your password>';
// Client secret
const clientSecret = '<client secret>';

const auth = new fns.LKFLAuth({ inn, password, clientSecret });
const client = new fns.Client({ auth });

const qr = '<your qr data scanned from the receipt>';
client
  .addReceipt(qr)
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
