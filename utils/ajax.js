import axios from 'axios';
const baseURL = `https://rest.hashgard.com/gard/api`
const $ajax = axios.create({
  baseURL
});

$ajax.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default $ajax;