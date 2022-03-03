export interface AuthInterface {
  authenticate(): Promise<void>;
  refreshTokens(): Promise<void>;
  getAccessToken(): string | undefined;
  getRefreshToken(): string | undefined;
  clearTokens(): void;
}
