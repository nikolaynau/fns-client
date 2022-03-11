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

## Example

Auth via the personal account of the FNS (https://lkfl2.nalog.ru)

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

## License

Licensed under the [MIT License](./LICENSE).
