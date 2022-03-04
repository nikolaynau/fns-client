import { SESSION_ID_HEADER } from 'fns-api';
import axios, { AxiosRequestHeaders } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProviderMock } from './utils/auth-provider.mock';
import { generateRandomString } from './utils/strings';
import { createAuthTokenIntercepter } from '../../lib/auth.intercepter';

describe('createAuthTokenIntercepter', () => {
  const clientSecret = generateRandomString();

  it('should set session id after authenticate', async () => {
    const accessToken = generateRandomString();
    const axiosInstance = axios.create();
    const mockAxiosInstance = new MockAdapter(axiosInstance);
    const mockAuthProvider = new AuthProviderMock({ clientSecret });
    mockAuthProvider.authenticateTokens = { accessToken };
    createAuthTokenIntercepter(axiosInstance, mockAuthProvider);

    mockAxiosInstance.onGet('/path').reply(200);

    const response = await axiosInstance.get('/path');

    expect(response.config.headers).toBeDefined();
    expect(
      (response.config.headers as AxiosRequestHeaders)[SESSION_ID_HEADER]
    ).toBe(accessToken);
  });
});
