import { AuthProvider, AuthProviderOptions } from '../auth.provider';

export interface RawTokensAuthOptions extends AuthProviderOptions {
  accessToken: string;
  refreshToken: string;
}

export class RawTokensAuth extends AuthProvider {
  constructor(options: RawTokensAuthOptions) {
    super(options);

    this.accessToken = options.accessToken;
    this.refreshToken = options.refreshToken;
  }

  authenticate(): Promise<void> {
    return Promise.resolve();
  }
}
