import Qs from 'qs';
import axios from 'axios';
import {FORCE_RERENDER} from "../app";

import config from '../config';
import {getJWTToken, removeJWTToken} from '../utils/auth';

const instance = axios.create({
  baseURL: config.api.route
});

export const get = async (params) => {
  try {
    const response = await instance({
      method: 'GET',
      url: params.route,
      headers: {
        'authorization': getJWTToken()
      },
      data: params.payload,
      params: params.params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      },
    });
    return response.data;
  } catch (error) {
    if(error.response.data.statusCode === 401) {
      removeJWTToken();
      FORCE_RERENDER();
    }
    console.error(error);
  }
};

export const post = async (params, authenticated = true) => {
  try {
    const response = await instance({
      method: 'POST',
      url: params.route,
      ...(authenticated ? {headers: {
        'authorization': getJWTToken()
      }} : {}),
      data: params.payload,
      params: params.params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      },
    });
    return response.data;
  } catch (error) {
    if(error.response.data.statusCode === 401) {
      removeJWTToken();
    }
    console.error(error);
    return {
      error: error.response.data,
    };
  }
};
