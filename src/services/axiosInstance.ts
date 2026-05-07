import axios, { AxiosInstance } from 'axios';
import { environment } from '@/config';
import { clearAllStorage, getObjectFromSessionStorage } from '@/lib/helperFunction';
import logger from '@/lib/logger';
import toast from 'react-hot-toast';
import type { RootState } from '@/app/store';
import { oidcConfig } from '@/auth/config';

let reduxStore: any = null;

export const injectStore = (store: any) => {
  reduxStore = store;
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // 🔹 Normal token (OIDC) from sessionStorage
      const tokenData = getObjectFromSessionStorage(`oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`);
      const accessToken = tokenData?.access_token;
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      // 🔹 ReadOnly check from Redux
      if (reduxStore) {
        const state = reduxStore.getState() as RootState;
        const decodedToken = state.tokenData;
        const isReadOnly = decodedToken?.decoded?.IsReadOnly === 'True';

        if (isReadOnly) {
          const method = (config.method || 'get').toLowerCase();
          const isWriteMethod = ['post', 'put', 'patch', 'delete'].includes(method);

          if (isWriteMethod) {
            toast.error('You are not authorized to perform this action.');
            // Cancel this request before it hits server
            return Promise.reject(new axios.Cancel('READ_ONLY_MODE'));
          }
        }
      }

      config.headers['DeviceType'] = 'web';
      return config;
    },
    (error) => {
      logger.error(error);
      return Promise.reject(error);
    }
  );

  // Response interceptor same as before
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        clearAllStorage();
        toast.error('Session expired. You will be redirected to DFC Portal.');
        setTimeout(() => {
          window.location.href = environment.exitUrl;
        }, 4000);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create multiple axios instances with different base URLs
export const apiInstance = createAxiosInstance(environment.apiUrl);
export const dmsAxiosInstance = createAxiosInstance(environment.dmsApiUrl);
export const openApiInstance = createAxiosInstance(environment.openApiUrl);

export default apiInstance;
