// src/utils/comments.js

import axios from './axios';

export const addComment = async (entryId, commentData, token) => {
  try {
    await axios.post(`/journal/${entryId}/comments`, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error.response.data.message;
  }
};

export const fetchComments = async (entryId) => {
  try {
    const response = await axios.get(`/journal/${entryId}/comments`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
