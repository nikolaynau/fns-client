import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {
  BASE_URL,
  defaultHeaders,
  ReceiptApi,
  ReceiptApiInterface
} from 'fns-api';
import { createAuthTokenIntercepter } from './auth.intercepter';
import type { AuthInterface, ClientInterface } from './interfaces';

export interface ClientOptions {
  auth: AuthInterface;
  axios?: AxiosInstance;
}

export class Client implements ClientInterface {
  private readonly auth: AuthInterface;
  private readonly receiptApi: ReceiptApiInterface;

  constructor(options: ClientOptions) {
    this.auth = options.auth;
    let axiosInstance = options.axios;

    if (!axiosInstance) {
      axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: defaultHeaders
      });
    }

    createAuthTokenIntercepter(axiosInstance, this.auth);
    createAuthRefreshInterceptor(axiosInstance, () =>
      this.auth.refreshTokens()
    );

    this.receiptApi = new ReceiptApi(axiosInstance);
  }

  addReceipt(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getReceipt(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getRceiptList(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  removeReceipt(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
