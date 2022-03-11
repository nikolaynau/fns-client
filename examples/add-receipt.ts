import * as fns from '..';

// Your INN from https://lkfl2.nalog.ru
const inn = '<your inn>';
// Your password from https://lkfl2.nalog.ru
const password = '<your password>';
// Client secret
const clientSecret = '<client secret>';

const auth = new fns.LKFLAuth({ inn, password, clientSecret });
const client = new fns.Client({ auth });

client
  .addReceipt({
    date: '2021-06-14T14:32',
    operationType: 1,
    sum: 43600,
    fsId: '9982450301247855',
    documentId: 65724,
    fiscalSign: '7634185632'
  })
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
