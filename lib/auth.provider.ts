import axios, { AxiosInstance } from 'axios';
import { BASE_URL, defaultHeaders, LoginApi, LoginApiInterface } from 'fns-api';
import { AuthInterface } from './interfaces';

export interface AuthProviderOptions {
  clientSecret: string;
  axios?: AxiosInstance;
  loginApi?: LoginApiInterface;
}

export abstract class AuthProvider implements AuthInterface {
  protected readonly clientSecret: string;
  protected readonly loginApi: LoginApiInterface;

  protected accessToken: string | undefined;
  protected refreshToken: string | undefined;

  constructor(options: AuthProviderOptions) {
    this.clientSecret = options.clientSecret;

    let loginApi = options.loginApi;
    if (!loginApi) {
      let axiosInstance = options.axios;
      if (!axiosInstance) {
        axiosInstance = axios.create({
          baseURL: BASE_URL,
          headers: defaultHeaders
        });
      }
      loginApi = new LoginApi(axiosInstance);
    }

    this.loginApi = loginApi;
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
