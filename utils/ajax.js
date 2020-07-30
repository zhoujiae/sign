import axios from 'axios';
import { Message } from 'element-ui';
import { baseURL } from '@/constants';

const $ajax = axios.create({ baseURL });

$ajax.interceptors.response.use(
  function(config) {
    return config;
  },
  function(error) {
    Message({
      type: 'error',
      message: 'Network Error',
      center: true
    });
    return Promise.reject(error);
  }
);

export default $ajax;
