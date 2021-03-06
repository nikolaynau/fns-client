import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SESSION_ID_HEADER } from 'fns-api';
import { AuthInterface } from './interfaces';

export function createAuthTokenIntercepter(
  instance: AxiosInstance,
  authProvider: AuthInterface
): number {
  return instance.interceptors.request.use(
    async (request: AxiosRequestConfig) => {
      if (!authProvider.getAccessToken()) {
        await authProvider.authenticate();
      }

      if (request.headers && authProvider.getAccessToken()) {
        request.headers[SESSION_ID_HEADER] =
          authProvider.getAccessToken() as string;
      }

      return request;
    }
  );
}
