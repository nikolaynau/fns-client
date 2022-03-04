import { LoginResponse, RefreshTokensRequest } from 'fns-api';
import { AuthProviderMock } from './utils/auth-provider.mock';
import { generateRandomString } from './utils/strings';

describe('AuthProvider', () => {
  const clientSecret = generateRandomString();

  it('should call refresh token api method', async () => {
    const newAccessToken = generateRandomString();
    const newRefreshToken = generateRandomString();
    const mockRefreshTokens = jest.fn().mockReturnValue(
      Promise.resolve({
        data: {
          sessionId: newAccessToken,
          refresh_token: newRefreshToken
        } as LoginResponse
      })
    );
    const authProvider = new AuthProviderMock({
      clientSecret,
      loginApi: { refreshTokens: mockRefreshTokens } as any
    });

    expect(authProvider.getAccessToken()).toBeUndefined();
    expect(authProvider.getRefreshToken()).toBeUndefined();

    authProvider.authenticateTokens = {
      accessToken: generateRandomString(),
      refreshToken: generateRandomString()
    };
    await authProvider.authenticate();

    const accessToken = authProvider.getAccessToken();
    const refreshToken = authProvider.getRefreshToken();
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    await authProvider.refreshTokens();

    expect(mockRefreshTokens).toHaveBeenCalled();
    expect(mockRefreshTokens).toHaveBeenCalledWith({
      client_secret: clientSecret,
      refresh_token: refreshToken
    } as RefreshTokensRequest);
  });

  it('should be empty tokens after clearing them', async () => {
    const authProvider = new AuthProviderMock({ clientSecret });
    expect(authProvider.getAccessToken()).toBeUndefined();
    expect(authProvider.getRefreshToken()).toBeUndefined();

    authProvider.authenticateTokens = {
      accessToken: generateRandomString(),
      refreshToken: generateRandomString()
    };
    await authProvider.authenticate();

    expect(authProvider.getAccessToken()).toBeDefined();
    expect(authProvider.getRefreshToken()).toBeDefined();

    authProvider.clearTokens();

    expect(authProvider.getAccessToken()).toBeUndefined();
    expect(authProvider.getRefreshToken()).toBeUndefined();
  });
});
