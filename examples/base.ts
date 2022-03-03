import * as fns from '..';

const auth = new fns.LKFLAuth({
  inn: '<your inn>',
  password: '<your password>',
  clientSecret: '<client secret>'
});

const client = new fns.Client({ auth });

async function main() {
  const request = await client.addReceipt(qr);
  const receipt = await client.getReceipt(request.id);

  if (receipt.status.isSuccess()) {
    console.log(receipt.details);
  }
}

main().catch(console.error);
