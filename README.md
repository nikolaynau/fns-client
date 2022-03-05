# fns-client

> Client for get receipts using the FNS API.

## Installation

```bash
npm install fns-client
```

## Usage

```js
// App.js
import * as fns from '..';

// Your INN from https://lkfl2.nalog.ru
const inn = '<your inn>';
// Your password from https://lkfl2.nalog.ru
const password = '<your password>';
// Client secret
const clientSecret = '<client secret>';
// QR-data string from the receipt
const qr = '<your qr data scanned from the receipt>';

const auth = new fns.LKFLAuth({ inn, password, clientSecret });
const client = new fns.Client({ auth });

async function main() {
  const response = await client.addReceipt(qr);
  const receipt = await client.getReceipt(response.id);

  if (fns.ReceiptStatusUtil.isSuccess(receipt.status)) {
    console.log(receipt.ticket?.document.receipt);
  }
}

main().catch(console.error);
```

## License

Licensed under the [MIT License](./LICENSE).
