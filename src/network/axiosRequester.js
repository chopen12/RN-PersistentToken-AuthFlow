import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const APIController = axios.create({
  baseURL: 'https://challenge.maniak.co',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 6000,
});

APIController.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete APIController.defaults.headers.common.Authorization;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

export default APIController;
