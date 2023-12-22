import Qs from 'qs';
import axios, { AxiosError } from 'axios';
import { FORCE_RERENDER } from '../app';

import { getJWTToken, removeJWTToken } from '../utils/auth';

const instance = axios.create({
  baseURL: '/api',
});

interface ApiParams {
  route: string;
  payload?: { [key: string]: string };
  params?: any;
}

export const get = async <DataType>(
  params: ApiParams
): Promise<DataType | undefined> => {
  try {
    const response = await instance.get<DataType>(params.route, {
      url: params.route,
      headers: {
        authorization: getJWTToken(),
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
      const isUnauthorized = error.response?.data.statusCode === 401;
      if (isUnauthorized) {
        removeJWTToken();
        FORCE_RERENDER();
      }
    }
    console.error(error);
  }
};

export const post = async <DataType>(
  params: ApiParams,
  authenticated = true
) => {
  try {
    const response = await instance.post<DataType>(params.route, {
      ...(authenticated
        ? {
            headers: {
              authorization: getJWTToken(),
            },
          }
        : {}),
      data: params.payload,
      params: params.params,
      paramsSerializer: function (params: any) {
        return Qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const isUnauthorized = error.response?.data.statusCode === 401;
      if (isUnauthorized) {
        removeJWTToken();
      }
      return {
        error: error.response?.data,
      };
    }
    return {
      error: 'unknown error',
    };
  }
};
