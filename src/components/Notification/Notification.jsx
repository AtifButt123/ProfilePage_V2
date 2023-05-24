import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notification = ({ currentUserPublicKey }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // Fetch friend requests for the current user from the backend API
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/persons/${currentUserPublicKey}/friendRequests`);
        const data = await response.json();
        setFriendRequests(data.friendRequests);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendRequests();
  }, [currentUserPublicKey]);

  const handleAcceptRequest = async (friendPublicKey) => {
    try {
      const response = await axios.post(`http://localhost:5000/persons/${currentUserPublicKey}/acceptFriendRequest`, {
        publicKey: friendPublicKey
      });

      if (response.data.message === 'Friend request accepted successfully') {
        window.alert('Friend request accepted successfully');
        setFriendRequests((prevRequests) => prevRequests.filter((request) => request !== friendPublicKey));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h3 className="mt-3">Friend Requests</h3>
      {friendRequests.length === 0 ? (
        <p>No pending friend requests</p>
      ) : (
        <ul className="list-group mt-3">
          {friendRequests.map((friendPublicKey) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={friendPublicKey}>
              Friend Request from: {friendPublicKey}
              <button
                className="btn btn-primary"
                onClick={() => handleAcceptRequest(friendPublicKey)}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
