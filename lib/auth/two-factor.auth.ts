import { AuthProvider, AuthProviderOptions } from '../auth.provider';

type OS = 'android' | 'ios';

export interface TwoFactorAuthOptions extends AuthProviderOptions {
  phone: string;
  os?: OS;
}

export class TwoFactorAuth extends AuthProvider {
  private readonly phone: string;
  private readonly os: OS;
  private code: string | undefined = undefined;

  constructor(options: TwoFactorAuthOptions) {
    super(options);
    this.phone = options.phone;
    this.os = options.os ?? 'android';
  }

  signIn(captcha: string): Promise<void> {
    return this.loginApi.loginByPhone({
      phone: this.phone,
      captcha,
      os: this.os,
      client_secret: this.clientSecret
    }) as Promise<any>;
  }

  setVerificationCode(value: string | undefined): void {
    this.code = value;
  }

  async authenticate(): Promise<void> {
    const {
      data: { sessionId, refresh_token }
    } = await this.loginApi.verifyPhone({
      phone: this.phone,
      code: this.code as string,
      client_secret: this.clientSecret
    });

    this.accessToken = sessionId;
    this.refreshToken = refresh_token;
  }
}
