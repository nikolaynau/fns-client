import axios, { AxiosInstance, CancelToken } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {
  BASE_URL,
  defaultHeaders,
  FiscalData,
  ReceiptApi,
  ReceiptApiInterface,
  ReceiptDetails,
  ReceiptShort
} from 'fns-api';
import { createAuthTokenIntercepter } from './auth.intercepter';
import type { AuthInterface, ClientInterface } from './interfaces';

export interface ClientOptions {
  auth: AuthInterface;
  axios?: AxiosInstance;
  receiptApi?: ReceiptApiInterface;
}

export class Client implements ClientInterface {
  private readonly auth: AuthInterface;
  private readonly receiptApi: ReceiptApiInterface;

  constructor(options: ClientOptions) {
    this.auth = options.auth;

    let receiptApi = options.receiptApi;
    if (!receiptApi) {
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

      receiptApi = new ReceiptApi(axiosInstance);
    }

    this.receiptApi = receiptApi;
  }

  addReceipt(
    fiscalData: FiscalData,
    cancelToken?: CancelToken
  ): Promise<ReceiptShort>;
  addReceipt(qr: string, cancelToken?: CancelToken): Promise<ReceiptShort>;
  async addReceipt(
    fiscalDataOrQR: FiscalData | string,
    cancelToken?: CancelToken
  ): Promise<ReceiptShort> {
    if (typeof fiscalDataOrQR === 'string') {
      const response = await this.receiptApi.addReceiptQR(
        { qr: fiscalDataOrQR },
        cancelToken
      );
      return response.data;
    } else {
      const response = await this.receiptApi.addReceipt(
        { fiscalData: fiscalDataOrQR, sendToEmail: false },
        cancelToken
      );
      return response.data;
    }
  }

  async getReceipt(
    id: string,
    cancelToken?: CancelToken
  ): Promise<ReceiptDetails> {
    const response = await this.receiptApi.getReceipt(id, cancelToken);
    return response.data;
  }

  async getReceipts(cancelToken?: CancelToken): Promise<ReceiptShort[]> {
    const response = await this.receiptApi.getReceipts(cancelToken);
    return response.data;
  }

  async removeReceipt(id: string, cancelToken?: CancelToken): Promise<void> {
    await this.receiptApi.removeReceipt(id, cancelToken);
  }
}
