const Qs = require('qs');
const config = require('../config');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const instance = axios.create({
  baseURL: config.api.route
});

export const get = async (params) => {
  try {
    const response = await instance({
      method: 'GET',
      url: params.route,
      headers: {
        'authorization': jwt.sign({
          iat: Date.now(),
          api_key: config.api.api_key
        }, config.api.secret)
      },
      data: params.payload,
      params: params.params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
