import axios, { AxiosInstance } from 'axios';
import { BASE_URL, defaultHeaders, LoginApi, LoginApiInterface } from 'fns-api';
import { AuthInterface } from './interfaces';

export interface AuthProviderOptions {
  clientSecret: string;
  axios?: AxiosInstance;
}

export abstract class AuthProvider implements AuthInterface {
  private readonly clientSecret: string;
  private readonly loginApi: LoginApiInterface;

  protected accessToken: string | undefined;
  protected refreshToken: string | undefined;

  constructor(options: AuthProviderOptions) {
    this.clientSecret = options.clientSecret;
    let axiosInstance = options.axios;

    if (!axiosInstance) {
      axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: defaultHeaders
      });
    }

    this.loginApi = new LoginApi(axiosInstance);
  }

  abstract authenticate(): Promise<void>;

  async refreshTokens(): Promise<void> {
    const { data } = await this.loginApi.refreshTokens({
      refresh_token: this.refreshToken as string,
      client_secret: this.clientSecret
    });
    this.accessToken = data.sessionId;
    this.refreshToken = data.refresh_token;
  }

  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }
}
