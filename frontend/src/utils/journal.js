// src/utils/journal.js

import axios from './axios';

export const createEntry = async (entryData, token) => {
  try {
    await axios.post('/journal/create', entryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error.response.data.message;
  }
};

export const fetchEntries = async () => {
  try {
    const response = await axios.get('/journal');
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
