import { SESSION_ID_HEADER } from 'fns-api';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProviderMock } from './utils/auth-provider.mock';
import { generateRandomString } from './utils/strings';
import { createAuthTokenIntercepter } from '../../lib/auth.intercepter';

describe('createAuthTokenIntercepter', () => {
  const clientSecret = generateRandomString();
  let axiosInstance: AxiosInstance;
  let mockAuthProvider: AuthProviderMock;
  let mockAxiosInstance: MockAdapter;

  beforeEach(() => {
    axiosInstance = axios.create();
    mockAxiosInstance = new MockAdapter(axiosInstance);
    mockAuthProvider = new AuthProviderMock({ clientSecret });
    mockAuthProvider.authenticateTokens = {
      accessToken: generateRandomString()
    };
  });

  afterEach(() => {
    mockAxiosInstance.restore();
  });

  it('should set session id after authenticate', async () => {
    createAuthTokenIntercepter(axiosInstance, mockAuthProvider);
    mockAxiosInstance.onGet('/path').reply(200);

    const response = await axiosInstance.get('/path');

    expect(response.config.headers).toBeDefined();
    expect(
      (response.config.headers as AxiosRequestHeaders)[SESSION_ID_HEADER]
    ).toBe(mockAuthProvider.authenticateTokens?.accessToken);
  });

  it('should one call be authenticate when is no access token', async () => {
    const authenticateSpy = jest.spyOn(mockAuthProvider, 'authenticate');
    createAuthTokenIntercepter(axiosInstance, mockAuthProvider);

    expect(mockAuthProvider.getAccessToken()).toBeUndefined();
    mockAxiosInstance.onGet('/path').reply(200);

    await axiosInstance.get('/path');
    await axiosInstance.get('/path');

    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(mockAuthProvider.getAccessToken()).toBeDefined();

    authenticateSpy.mockClear();
    mockAuthProvider.clearTokens();
    expect(mockAuthProvider.getAccessToken()).toBeUndefined();

    await axiosInstance.get('/path');
    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(mockAuthProvider.getAccessToken()).toBeDefined();
  });
});
