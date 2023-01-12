import 'dotenv/config';
import { FiscalData, ReceiptShort } from 'fns-api';
import { ClientInterface } from 'lib';
import { AuthInterface, Client, LKFLAuth } from '../..';
import { expectIsDefined, expectIsNumber, expectNotEmptyString } from './util';

const inn = process.env.TEST_INN as string;
const password = process.env.TEST_PASSWORD as string;
const clientSecret = process.env.TEST_CLIENT_SECRET as string;
const fiscalData = JSON.parse(
  process.env.TEST_FISCAL_DATA as string
) as FiscalData;
const qrData = process.env.TEST_QR_DATA as string;

describe('Client (e2e)', () => {
  let auth: AuthInterface;
  let client: ClientInterface;

  beforeAll(async () => {
    auth = new LKFLAuth({ inn, password, clientSecret });
    client = new Client({ auth });
  });

  it('addReceipt by fiscal data', async () => {
    const receipt = await client.addReceipt(fiscalData);
    expectIsNumber(receipt.status);
    expectNotEmptyString(receipt.id);
  });

  it('addReceipt by QR', async () => {
    const receipt = await client.addReceipt(qrData);
    expectIsNumber(receipt.status);
    expectNotEmptyString(receipt.id);
  });

  it('getReceipts', async () => {
    const receipt = await client.addReceipt(qrData);
    expectNotEmptyString(receipt.id);

    const receipts = await client.getReceipts();
    expect(Array.isArray(receipts)).toBe(true);
    expect(receipts.length > 0).toBe(true);

    const actualReceipt = receipts.find(
      r => r.id === receipt.id
    ) as ReceiptShort;
    expectIsDefined(actualReceipt);
  });

  it('removeReceipt', async () => {
    const receipt = await client.addReceipt(qrData);
    expectNotEmptyString(receipt.id);

    const receipts = await client.getReceipts();
    expect(Array.isArray(receipts)).toBe(true);
    expect(receipts.length > 0).toBe(true);
    expectIsDefined(receipts.find(r => r.id === receipt.id));

    await client.removeReceipt(receipt.id);

    const newReceipts = await client.getReceipts();
    expect(Array.isArray(newReceipts)).toBe(true);
    expect(newReceipts.find(r => r.id === receipt.id)).toBeUndefined();
  });

  it('getReceipt', async () => {
    const receipt = await client.addReceipt(qrData);
    expectNotEmptyString(receipt.id);

    const receiptDetails = await client.getReceipt(receipt.id);
    expectIsDefined(receiptDetails);
    expectIsDefined(receiptDetails.ticket);
    expectIsDefined(receiptDetails.ticket?.document);
    expectIsDefined(receiptDetails.ticket?.document.receipt);
  });

  it('should refresh tokens when session id is expired or invalid', async () => {
    const receipt = await client.addReceipt(qrData);
    expectIsNumber(receipt.status);
    expectNotEmptyString(receipt.id);

    (client as any).auth.accessToken = 'invalid access token';

    const newReceipt = await client.addReceipt(qrData);
    expectIsNumber(newReceipt.status);
    expectNotEmptyString(newReceipt.id);
  });

  it('should repeat auth when session id is empty', async () => {
    const receipt = await client.addReceipt(qrData);
    expectIsNumber(receipt.status);
    expectNotEmptyString(receipt.id);

    (client as any).auth.accessToken = undefined;

    const newReceipt = await client.addReceipt(qrData);
    expectIsNumber(newReceipt.status);
    expectNotEmptyString(newReceipt.id);
  });
});
