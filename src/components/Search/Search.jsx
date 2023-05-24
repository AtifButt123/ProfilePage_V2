import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import { debounce } from 'lodash';

function Search({ onPersonClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    if (!query) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/persons/search?name=${query}&publicKey=${query}`);
      const updatedResults = res.data.map((person) => {
        const isFriend = person.friends.includes('1'); // Replace '1' with the current user's public key
        const hasFriendRequest = person.friendRequests.includes('1'); // Replace '1' with the current user's public key
        return {
          ...person,
          isFriend,
          hasFriendRequest,
        };
      });
      setResults(updatedResults);
    } catch (err) {
      console.error(err);
    }
  };

  const delayedSearch = debounce(handleSearch, 500);

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    delayedSearch(value);
    if (!value) {
      setResults([]);
    }
  };

  const handleFriendAdd = async (personId) => {
    try {
      // Check if person is already a friend
      const person = results.find((p) => p.publicKey === personId);
      if (person.isFriend) {
        window.alert("You are already a friend!");
        return; // do nothing if already a friend
      }

      // Check if friend request has already been sent
      if (person.hasFriendRequest) {
        window.alert("Friend request already sent!");
        return; // do nothing if friend request already sent
      }

      // Add person as friend
      await axios.post(`http://localhost:5000/persons/${personId}/sendFriendRequest`, {
        publicKey: '1', // Replace '1' with the current user's public key
      });

      // Update the friend array of the current person
      const updatedResults = results.map((p) => {
        if (p.publicKey === '1') {
          return {
            ...p,
            friendRequests: [...p.friendRequests, personId],
          };
        }
        return p;
      });

      setResults(updatedResults);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, []);

  return (
    <div className="search-container my-3">
      <div className="search-form">
        <input type="text" value={query} onChange={handleChange} placeholder="Search by name or key" />
        <button onClick={() => handleSearch(query)}><FaSearch /></button>
      </div>
      <ul className="search-results">
        {results.map((person) => (
          <li key={person.publicKey} className="search-result">
            <button onClick={() => onPersonClick(person.publicKey)}>{person.name}</button>
            <button
              className='ml-3'
              onClick={() => handleFriendAdd(person.publicKey)}
              disabled={person.isFriend || person.hasFriendRequest}
            >
              <FaUserPlus />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
