import { AuthProvider, AuthProviderOptions } from '../auth.provider';

export type TwoFactorAuthOptions = AuthProviderOptions;

export class TwoFactorAuth extends AuthProvider {
  constructor(options: TwoFactorAuthOptions) {
    super(options);
  }

  authenticate(): Promise<void> {
    return Promise.resolve();
  }
}
