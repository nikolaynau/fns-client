import * as fns from '..';

// Your INN from https://lkfl2.nalog.ru
const inn = '<your inn>';
// Your password from https://lkfl2.nalog.ru
const password = '<your password>';
// Client secret
const clientSecret = '<client secret>';

const auth = new fns.LKFLAuth({ inn, password, clientSecret });
const client = new fns.Client({ auth });

async function main() {
  // First step: your need add receipt by QR-data or fiscal data
  const response = await client.addReceipt('<your qr-data from receipt>');

  // Second step: periodically pull from the server for information about the receipt
  const receiptId = response.id;
  const receipt = await client.getReceipt(receiptId);

  // If the successful status means that the receipt has been received
  if (fns.ReceiptStatusUtil.isSuccess(receipt.status)) {
    console.log(receipt.ticket?.document.receipt);
  }
}

main().catch(console.error);
