// src/components/Journal/EntryForm.js

import React, { useState } from 'react';
import { createEntry } from '../../utils/journal';

const EntryForm = ({ token }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('pdf', pdfFile);

    try {
      await createEntry(formData, token);
      // Optionally, you can redirect or show a success message after entry creation
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h2>Create New Entry</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EntryForm;
