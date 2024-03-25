// src/utils/auth.js

import axios from './axios';

export const login = async (userData) => {
  try {
    const response = await axios.post('/login', userData);
    return response.data.token;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const register = async (userData) => {
  try {
    await axios.post('/register', userData);
  } catch (error) {
    throw error.response.data.message;
  }
};
