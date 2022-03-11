import 'dotenv/config';
import { LKFLAuth } from '../..';
import { expectNotEmptyString } from './util';

const inn = process.env.TEST_INN as string;
const password = process.env.TEST_PASSWORD as string;
const clientSecret = process.env.TEST_CLIENT_SECRET as string;

describe('Auth (e2e)', () => {
  it('LKFL', async () => {
    const auth = new LKFLAuth({ inn, password, clientSecret });
    await auth.authenticate();
    expectNotEmptyString(auth.getAccessToken());
    expectNotEmptyString(auth.getRefreshToken());
  });
});
