import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { SESSION_ID_HEADER } from 'fns-api';
import { AuthInterface } from './interfaces';

export function createAuthTokenIntercepter(
  instance: AxiosInstance,
  authProvider: AuthInterface
): number {
  return instance.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      if (!authProvider.getAccessToken()) {
        await authProvider.authenticate();
      }

      if (request.headers && authProvider.getAccessToken()) {
        (request.headers as Record<string, string>)[SESSION_ID_HEADER] =
          authProvider.getAccessToken() as string;
      }

      return request;
    }
  );
}
