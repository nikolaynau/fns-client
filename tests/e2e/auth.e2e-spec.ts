import 'dotenv/config';
import { LKFLAuth } from '../..';

const inn = process.env.TEST_INN as string;
const password = process.env.TEST_PASSWORD as string;
const clientSecret = process.env.TEST_CLIENT_SECRET as string;

describe('Auth (e2e)', () => {
  it('LKFL', async () => {
    const auth = new LKFLAuth({ inn, password, clientSecret });
    await auth.authenticate();
    expect(typeof auth.getAccessToken()).toBe('string');
    expect(typeof auth.getRefreshToken()).toBe('string');
    expect(auth.getAccessToken()).not.toBe('');
    expect(auth.getRefreshToken()).not.toBe('');
  });
});
