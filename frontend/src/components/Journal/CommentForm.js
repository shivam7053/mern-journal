// src/components/Journal/CommentForm.js

import React, { useState } from 'react';
import { addComment } from '../../utils/comments';

const CommentForm = ({ entryId, token, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(entryId, { content }, token);
      setContent('');
      onCommentAdded();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h3>Add Comment</h3>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Enter your comment" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentForm;
