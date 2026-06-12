import Qs from 'qs';
import axios, { AxiosError } from 'axios';

import { authStore } from '../auth-store';
import { PostResponse } from './types';
import config from '../config';

const instance = axios.create({
  baseURL: `${config.api.route}/api`,
});

interface ApiParams {
  route: string;
  payload?: any;
  params?: any;
}

export const get = async <DataType>(
  params: ApiParams
): Promise<DataType | undefined> => {
  try {
    const response = await instance.get<DataType>(params.route, {
      url: params.route,
      headers: {
        Authorization: `Bearer ${authStore.getToken() ?? ''}`,
      },
      data: params.payload,
      params: params.params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const isUnauthorized = error.response?.status === 401;
      if (isUnauthorized) {
        authStore.signOut();
      }
    }
    console.error(error);
  }
};

export const post = async <DataType>(
  params: ApiParams,
  authenticated = true
): Promise<PostResponse<DataType>> => {
  try {
    const response = await instance.post<DataType>(
      params.route,
      params.payload,
      {
        ...(authenticated
          ? {
              headers: {
                authorization: authStore.getToken() ?? '',
              },
            }
          : {}),
        params: params.params,
        paramsSerializer: function (params: any) {
          return Qs.stringify(params, { arrayFormat: 'repeat' });
        },
      }
    );
    return { data: response.data, error: undefined };
  } catch (error) {
    if (error instanceof AxiosError) {
      const isUnauthorized = error.response?.status === 401;
      if (isUnauthorized) {
        authStore.signOut();
      }
      return {
        data: undefined,
        error: {
          statusCode: error.response?.data.statusCode,
          message: error.response?.data.message,
        },
      };
    }
    return {
      data: undefined,
      error: { statusCode: 400, message: 'Unknown error' },
    };
  }
};

export const put = async <DataType>(
  params: ApiParams
): Promise<PostResponse<DataType>> => {
  try {
    const response = await instance.put<DataType>(
      params.route,
      params.payload,
      {
        headers: {
          authorization: authStore.getToken() ?? '',
        },

        params: params.params,
        paramsSerializer: function (params: any) {
          return Qs.stringify(params, { arrayFormat: 'repeat' });
        },
      }
    );
    return { data: response.data, error: undefined };
  } catch (error) {
    if (error instanceof AxiosError) {
      const isUnauthorized = error.response?.status === 401;
      if (isUnauthorized) {
        authStore.signOut();
      }
      return {
        data: undefined,
        error: {
          statusCode: error.response?.data.statusCode,
          message: error.response?.data.message,
        },
      };
    }
    return {
      data: undefined,
      error: { statusCode: 400, message: 'Unknown error' },
    };
  }
};
