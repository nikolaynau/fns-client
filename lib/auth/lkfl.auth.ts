import { AuthProvider, AuthProviderOptions } from '../auth.provider';

export interface LKFLAuthOptions extends AuthProviderOptions {
  inn: string;
  password: string;
}

export class LKFLAuth extends AuthProvider {
  private readonly inn: string;
  private readonly password: string;

  constructor(options: LKFLAuthOptions) {
    super(options);
    this.inn = options.inn;
    this.password = options.password;
  }

  async authenticate(): Promise<void> {
    const {
      data: { sessionId, refresh_token }
    } = await this.loginApi.loginLKFL({
      inn: this.inn,
      password: this.password,
      client_secret: this.clientSecret
    });

    this.accessToken = sessionId;
    this.refreshToken = refresh_token;
  }
}
