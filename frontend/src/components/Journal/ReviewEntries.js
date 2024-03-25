// src/components/Journal/ReviewEntries.js

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const ReviewEntries = ({ token }) => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntriesForReview = async () => {
      try {
        const response = await axios.get('/journal/for-review', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(response.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    fetchEntriesForReview();
  }, [token]);

  const handleReview = async (entryId) => {
    try {
      await axios.put(`/journal/${entryId}/review`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optionally, you can update state or show a success message
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Review Journal Entries</h2>
      {error && <p>{error}</p>}
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
            <button onClick={() => handleReview(entry._id)}>Approve</button>
            <button onClick={() => handleReject(entry._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewEntries;
