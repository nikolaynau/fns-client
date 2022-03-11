# fns-client

> Client for get receipts using the FNS API.

## Installation

```bash
npm install fns-client
```

## Usage

```js
// App.js
import * as fns from 'fns-client';

// Choose an auth and create it
const auth = new fns.LKFLAuth({ inn, password, clientSecret });
// Instantiate the client and pass the auth object
const client = new fns.Client({ auth });

async function main() {
  // Add a receipt and get receipt id
  const response = await client.addReceipt(qr);
  // By receipt id try to get detailed information, until the status is successful
  const receipt = await client.getReceipt(response.id);

  // If the status is successful, then information about the receipt is available
  if (fns.ReceiptStatusUtil.isSuccess(receipt.status)) {
    console.log(receipt.ticket?.document.receipt);
  }
}

main().catch(console.error);
```

## Example

Auth via the personal account of the FNS ([lkfl2.nalog.ru](https://lkfl2.nalog.ru))

```js
import * as fns from 'fns-client';

// Your INN from https://lkfl2.nalog.ru
const inn = '<your inn>';
// Your password from https://lkfl2.nalog.ru
const password = '<your password>';
// Client secret
const clientSecret = '<client secret>';

const auth = new fns.LKFLAuth({ inn, password, clientSecret });
const client = new fns.Client({ auth });
```

There is also authentication via [OAuth2 ESIA](./examples/auth-esia.ts), [phone number](./examples/auth-phone.ts) and [raw tokens](./examples/auth-raw-tokens.ts).

To get information about a receipt, you must first add it

```js
// Add receipt by fiscal data
const fiscalData = {
  date: '2021-06-14T14:32',
  operationType: 1,
  sum: 43600,
  fsId: '9982450301247855',
  documentId: 65724,
  fiscalSign: '7634185632'
};

client
  .addReceipt(fiscalData)
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
```

We add a receipt according to the data from the QR-code on the receipt

```js
// Add receipt by QR-data
const qr = '<your qr data scanned from the receipt>';

client
  .addReceipt(qr)
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
```

Next, you need to periodically poll the server to check status is successfully

```js
const receiptId = '<your receipt id received when adding it>';

async function main() {
  const receipt = await client.getReceipt(receiptId);

  // If the successful status means that the receipt has been received
  if (fns.ReceiptStatusUtil.isSuccess(receipt.status)) {
    console.log(receipt.ticket?.document.receipt);
  }
}

main().catch(console.error);
```

Since when you add a receipt, you create a request for it and must wait, until the internal system receives detailed information about your receipt.

See [examples](./examples) for more details.

## License

Licensed under the [MIT License](./LICENSE).
