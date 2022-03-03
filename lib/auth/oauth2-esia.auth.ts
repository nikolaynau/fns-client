import { AuthProvider, AuthProviderOptions } from '../auth.provider';

export type OAuth2EsiaAuthOptions = AuthProviderOptions;

export class OAuth2EsiaAuth extends AuthProvider {
  constructor(options: OAuth2EsiaAuthOptions) {
    super(options);
  }

  authenticate(): Promise<void> {
    return Promise.resolve();
  }
}
