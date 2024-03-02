import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../config/firebase-config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, deleteDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import Header from './Header';
import '../styles/Room.css';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    // Fetching room details including the room name
    const roomRef = doc(firestore, `rooms/${roomId}`);
  
    getDoc(roomRef).then((docSnap) => {
      if (!docSnap.exists()) {
        navigate('/'); // Redirect if room doesn't exist
        return;
      }
      // Assuming the room name is stored under a field named 'name'
      const roomDetails = docSnap.data();
      setRoomName(roomDetails.name); // Update the room name in the state
    });
  
    // Fetching messages for the room
    const messagesRef = collection(firestore, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy('createdAt'));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({...doc.data(), id: doc.id});
      });
      setMessages(messagesData);
    });
  
    return () => unsubscribe(); // Cleanup on component unmount or roomId change
  }, [roomId, navigate]); // Dependencies array

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return; // Prevent sending empty messages
    const alias = Cookies.get('userAlias') || 'Anonymous'; // Access the alias directly from cookies
    const messagesRef = collection(firestore, `rooms/${roomId}/messages`);
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: alias, // Use the alias obtained from cookies
    });
    setNewMessage('');
  };

  const handleDeleteRoom = async () => {
    try {
      // Reference to the document
      const roomRef = doc(firestore, `rooms/${roomId}`);
      // Delete the document
      await deleteDoc(roomRef);
      console.log(`Room with ID ${roomId} has been deleted.`);
      navigate('/');
    } catch (error) {
      console.error("Error deleting room: ", error);
    }
  };

  return (
    <div className="roomPageContainer">
      <div className="roomContainer">
        <Header roomName={roomName} onDeleteRoom={handleDeleteRoom} />
        <div className="roomContentContainer">
          <div className="messagesContainer">
            {messages.map((message) => (
              <p key={message.id} className="message">
                <p className="messageSender">{message.sender ? `${message.sender}` : ''}</p>
                <p className="messageContent">{message.text}</p>
              </p>
            ))}
          </div>
          <form onSubmit={sendMessage} className="messageForm">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="messageInput"
            />
            <button type="submit" className="sendMessageButton"><i className="bi bi-send-fill"></i></button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Room;
