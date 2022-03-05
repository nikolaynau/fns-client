import { AuthProvider, AuthProviderOptions } from '../auth.provider';

export type OAuth2EsiaAuthOptions = AuthProviderOptions;

export class OAuth2EsiaAuth extends AuthProvider {
  private authorizationCode: string | undefined = undefined;
  private state: string | undefined = undefined;

  constructor(options: OAuth2EsiaAuthOptions) {
    super(options);
  }

  async getEsiaUrl(): Promise<string> {
    const response = await this.loginApi.getUrlOAuthEsia();
    return response.data.url;
  }

  setAuthorizationCode(value: string | undefined) {
    this.authorizationCode = value;
  }

  setState(value: string | undefined) {
    this.state = value;
  }

  async authenticate(): Promise<void> {
    const {
      data: { sessionId, refresh_token }
    } = await this.loginApi.loginEsia({
      authorization_code: this.authorizationCode as string,
      state: this.state as string,
      client_secret: this.clientSecret
    });

    this.accessToken = sessionId;
    this.refreshToken = refresh_token;
  }
}
