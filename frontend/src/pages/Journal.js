// src/pages/Journal.js

import React from 'react';
import EntryForm from '../components/Journal/EntryForm';
import EntryList from '../components/Journal/EntryList';

const Journal = () => {
  return (
    <div>
      <h2>Journal</h2>
      <EntryForm />
      <EntryList />
    </div>
  );
};

export default Journal;
