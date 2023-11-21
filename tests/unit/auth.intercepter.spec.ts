import { SESSION_ID_HEADER } from 'fns-api';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProviderMock } from './utils/auth-provider.mock';
import { generateRandomString } from './utils/strings';
import { createAuthTokenIntercepter } from '../..';

describe('createAuthTokenIntercepter', () => {
  const clientSecret = generateRandomString();
  const testPath = '/path';
  let axiosInstance: AxiosInstance;
  let mockAuthProvider: AuthProviderMock;
  let mockAxiosInstance: any;

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
    mockAxiosInstance.onGet(testPath).reply(200);

    const response = await axiosInstance.get(testPath);

    expect(response.config.headers).toBeDefined();
    expect(
      (response.config.headers as AxiosRequestHeaders)[SESSION_ID_HEADER]
    ).toBe(mockAuthProvider.authenticateTokens?.accessToken);
  });

  it('should call authenticate once', async () => {
    const spy = jest.spyOn(mockAuthProvider, 'authenticate');
    createAuthTokenIntercepter(axiosInstance, mockAuthProvider);

    expect(mockAuthProvider.getAccessToken()).toBeUndefined();
    mockAxiosInstance.onGet(testPath).reply(200);

    await axiosInstance.get(testPath);
    await axiosInstance.get(testPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockAuthProvider.getAccessToken()).toBeDefined();
  });

  it('should call re-authentication once after clearing the tokens', async () => {
    const authenticateSpy = jest.spyOn(mockAuthProvider, 'authenticate');
    createAuthTokenIntercepter(axiosInstance, mockAuthProvider);

    expect(mockAuthProvider.getAccessToken()).toBeUndefined();
    mockAxiosInstance.onGet(testPath).reply(200);

    await axiosInstance.get(testPath);
    await axiosInstance.get(testPath);

    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(mockAuthProvider.getAccessToken()).toBeDefined();

    authenticateSpy.mockClear();
    mockAuthProvider.clearTokens();
    expect(mockAuthProvider.getAccessToken()).toBeUndefined();

    await axiosInstance.get(testPath);
    await axiosInstance.get(testPath);

    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(mockAuthProvider.getAccessToken()).toBeDefined();
  });
});
