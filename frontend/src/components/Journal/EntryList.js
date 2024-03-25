// src/components/Journal/EntryList.js

import React, { useState, useEffect } from 'react';
import { fetchEntries } from '../../utils/journal';

const EntryList = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntriesData = async () => {
      try {
        const data = await fetchEntries();
        setEntries(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchEntriesData();
  }, []);

  return (
    <div>
      <h2>Journal Entries</h2>
      {error && <p>{error}</p>}
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
            <a href={`http://localhost:5000/uploads/${entry.pdfFilename}`} target="_blank" rel="noopener noreferrer">View PDF</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryList;
