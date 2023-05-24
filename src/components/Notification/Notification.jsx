import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptFriendRequest = async (notificationId, friendId) => {
    try {
      await axios.post(`http://localhost:5000/persons/${friendId}/friends`, { friendId });
      await axios.delete(`http://localhost:5000/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectFriendRequest = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 && <p>No new notifications</p>}
      {notifications.map((notification) => (
        <div key={notification._id}>
          <p>
            Friend request from {notification.sender.name}
          </p>
          <button onClick={() => handleAcceptFriendRequest(notification._id, notification.sender._id)}>Accept</button>
          <button onClick={() => handleRejectFriendRequest(notification._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

