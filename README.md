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

## License

Licensed under the [MIT License](./LICENSE).
