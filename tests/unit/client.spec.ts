import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  AddReceiptQRRequest,
  LKFLLoginRequest,
  LoginResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  SESSION_ID_HEADER
} from 'fns-api';
import { Client, LKFLAuth } from '../..';
import { generateRandomString } from './utils/strings';

describe('Client', () => {
  const clientSecret = generateRandomString();
  const inn = generateRandomString();
  const password = generateRandomString();
  const accessToken = generateRandomString();
  const refreshToken = generateRandomString();
  const qr = generateRandomString();
  const lkflPath = 'v2/mobile/users/lkfl/auth';
  const refreshTokensPath = 'v2/mobile/users/refresh';
  const addReceiptPath = 'v2/ticket';
  let authAxios: AxiosInstance;
  let clientAxios: AxiosInstance;
  let mockAuthAxios: any;
  let mockClientAxios: any;
  let auth: LKFLAuth;
  let client: Client;

  beforeEach(() => {
    authAxios = axios.create();
    clientAxios = axios.create();
    auth = new LKFLAuth({ clientSecret, inn, password, axios: authAxios });
    client = new Client({ auth, axios: clientAxios });
    mockAuthAxios = new MockAdapter(authAxios);
    mockClientAxios = new MockAdapter(clientAxios);
  });

  afterEach(() => {
    mockAuthAxios.restore();
    mockClientAxios.restore();
  });

  it('should call authenticate once and add session id to header', async () => {
    const spy = jest.spyOn(auth, 'authenticate');

    mockAuthAxios
      .onPost(lkflPath, {
        client_secret: clientSecret,
        inn,
        password
      } as LKFLLoginRequest)
      .reply(200, {
        sessionId: accessToken,
        refresh_token: refreshToken
      } as LoginResponse)
      .onAny()
      .reply(500);

    mockClientAxios
      .onPost(
        addReceiptPath,
        { qr } as AddReceiptQRRequest,
        expect.objectContaining({
          [SESSION_ID_HEADER]: expect.stringMatching(accessToken)
        })
      )
      .reply(200)
      .onAny()
      .reply(500);

    await client.addReceipt(qr);
    await client.addReceipt(qr);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(auth.getAccessToken()).toBe(accessToken);
  });

  it('should refresh tokens when method returns 401 http code', async () => {
    const authenticateSpy = jest.spyOn(auth, 'authenticate');
    const refreshTokensSpy = jest.spyOn(auth, 'refreshTokens');

    const newAccessToken = generateRandomString();
    const newRefreshToken = generateRandomString();

    mockAuthAxios
      .onPost(lkflPath, {
        client_secret: clientSecret,
        inn,
        password
      } as LKFLLoginRequest)
      .reply(200, {
        sessionId: accessToken,
        refresh_token: refreshToken
      } as LoginResponse)
      .onPost(refreshTokensPath, {
        client_secret: clientSecret,
        refresh_token: refreshToken
      } as RefreshTokensRequest)
      .reply(200, {
        sessionId: newAccessToken,
        refresh_token: newRefreshToken
      } as RefreshTokensResponse)
      .onAny()
      .reply(500);

    mockClientAxios
      .onPost(
        addReceiptPath,
        { qr } as AddReceiptQRRequest,
        expect.objectContaining({
          [SESSION_ID_HEADER]: expect.stringMatching(accessToken)
        })
      )
      .replyOnce(200)
      .onPost(
        addReceiptPath,
        { qr } as AddReceiptQRRequest,
        expect.objectContaining({
          [SESSION_ID_HEADER]: expect.stringMatching(accessToken)
        })
      )
      .replyOnce(401)
      .onPost(
        addReceiptPath,
        { qr } as AddReceiptQRRequest,
        expect.objectContaining({
          [SESSION_ID_HEADER]: expect.stringMatching(newAccessToken)
        })
      )
      .replyOnce(200)
      .onAny()
      .reply(500);

    await client.addReceipt(qr);
    expect(auth.getAccessToken()).toBe(accessToken);
    expect(auth.getRefreshToken()).toBe(refreshToken);

    await client.addReceipt(qr);
    expect(auth.getAccessToken()).toBe(newAccessToken);
    expect(auth.getRefreshToken()).toBe(newRefreshToken);

    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(refreshTokensSpy).toHaveBeenCalledTimes(1);
  });
});
