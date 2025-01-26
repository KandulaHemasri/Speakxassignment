import React, { useState } from 'react';
import axios from 'axios';
import './Query.css';

function Query() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchQuestions = async (newPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/search', {
        params: { q: query, page: newPage },
      });
      setResults(response.data.results);
      setPage(response.data.page);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Error during search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchQuestions(1); // Always reset to the first page
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      searchQuestions(newPage);
    }
  };


  return (
    <div>
      <h1>Quest Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && results.length === 0 && <p>No results found.</p>}

<ul>
  {results.map((question) => {
    let solution;

    if (question.type === "MCQ") {
     
      const correctOption = question.options?.find((opt) => opt.isCorrectAnswer);
      solution = correctOption ? correctOption.text : "None";
    } else {
      
      solution = question.solution || "None";
    }

    return (
      <li key={question._id}>
        <strong>Id: {question._id}</strong>
        <br />
        <strong>Type: </strong> {question.type}
        <br />
        <strong>Title: </strong> {question.title}
        <br />
        <strong>Solution: </strong> {solution}
      </li>
    );
  })}
</ul>



<div className='pagination'>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          
        >
          Prev
        </button>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className='prevNext'
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Query;
