import { AuthProvider } from '../../../lib/auth.provider';

export class AuthProviderMock extends AuthProvider {
  authenticateTokens?: { accessToken?: string; refreshToken?: string };

  authenticate(): Promise<void> {
    this.accessToken = this.authenticateTokens?.accessToken;
    this.refreshToken = this.authenticateTokens?.refreshToken;
    return Promise.resolve();
  }
}
