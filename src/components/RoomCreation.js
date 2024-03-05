import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../utils/roomService';
import Cookies from 'js-cookie';
import '../styles/RoomCreation.css';

function RoomCreation() {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }
    const roomId = await createRoom(roomName, Cookies.get('userId'));
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      console.error("Failed to create room.");
    }
  };

  return (
    <div className="roomCreationContainer">
      <div className='roomCreationSubContainer'>
        <img alt="logo" src="logo.webp" className='logo'></img>
        <p className="creationTitle">Welcome to TempTalk!</p>
        <p className="creationOverview">TempTalk is web platform for quickly creating disposable chat rooms. Enter a name for your chat room below and create a room to start chatting.</p>
        <form onSubmit={handleSubmit} className="creationForm">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room Name"
            className="roomInput"
          />
          <button type="submit" className="createRoomButton">Create</button>
        </form>
      </div>
    </div>
  );
};

export default RoomCreation;
