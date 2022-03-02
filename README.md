# fns-client

> Client for get receipts using the FNS API.

## Installation

```bash
npm install fns-client
```

## Usage

```js
// App.js
import * as fns from "fns-client";

const client = new fns.Client({
  clientSecret: "<client secret>",
});

async function main() {
  await client.login(LoginType.LKFL, {
    inn: "<your inn>",
    password: "<your password>",
  });
  const request = await client.addReceipt(qr);
  const details = await client.getReceipt(request.id);

  if (details.status.isSuccess()) {
    console.log(details.receipt);
  }
}

main.catch(console.error);
```

## License

Licensed under the [MIT License](./LICENSE).
