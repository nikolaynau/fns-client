import { AuthProvider, AuthProviderOptions } from '../auth.provider';

export interface LKFLAuthOptions extends AuthProviderOptions {
  inn: string;
  password: string;
}

export class LKFLAuth extends AuthProvider {
  constructor(options: LKFLAuthOptions) {
    super(options);
  }

  authenticate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
