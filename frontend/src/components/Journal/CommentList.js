// src/components/Journal/CommentList.js

import React, { useState, useEffect } from 'react';
import { fetchComments } from '../../utils/comments';

const CommentList = ({ entryId }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntryComments = async () => {
      try {
        const data = await fetchComments(entryId);
        setComments(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchEntryComments();
  }, [entryId]);

  return (
    <div>
      <h3>Comments</h3>
      {error && <p>{error}</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <p>{comment.content}</p>
            <p>By: {comment.author.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
