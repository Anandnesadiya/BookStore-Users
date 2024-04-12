import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    console.log(accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstance;