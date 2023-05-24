import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import { debounce } from 'lodash';

function Search({ onPersonClick }) {
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    if (!query) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/persons/search?name=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const delayedSearch = debounce(handleSearch, 500);

  const handleChange = (event) => {
    const query = event.target.value;
    setName(query);
    delayedSearch(query);
    if (!query) {
      setResults([]);
    }
  };

  const handleFriendAdd = async (personId) => {
    try {
      // Check if person is already a friend
      const person = results.find((p) => p.publicKey === personId);
      if (person.friends.includes(personId)) {
        window.alert("Friend is already added!");
        return; // do nothing if already a friend
      }

      // Add person as friend
      await axios.post(`http://localhost:5000/persons/1/friends/`, {
        friendId: personId,
      });

      // Update the friend array of the current person
      const updatedResults = results.map((p) => {
        if (p.publicKey === 1) {
          return {
            ...p,
            friends: [...p.friends, personId],
          };
        }
        return p;
      });

      setResults(updatedResults);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="search-container my-3">
      <div className="search-form">
        <input type="text" value={name} onChange={handleChange} placeholder="Search by name or key" />
        <button onClick={() => handleSearch(name)}><FaSearch /></button>
      </div>
      <ul className="search-results">
        {results.map((person) => (
          <li key={person.publicKey} className="search-result">
            <button onClick={() => onPersonClick(person.publicKey)}>{person.name}</button>
            <button className='ml-3' onClick={() => handleFriendAdd(person.publicKey)}><FaUserPlus /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
