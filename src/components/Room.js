import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../config/firebase-config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, doc, deleteDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import Header from './Header';
import '../styles/Room.css';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [alias, setAlias] = useState('');
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const roomRef = doc(firestore, `rooms/${roomId}`);

    if (!Cookies.get('userAlias')) {
      Cookies.set('userAlias', "anonymous", { expires: 7 });
      setAlias(Cookies.get('userAlias'));
    } else {
      setAlias(Cookies.get('userAlias'));
    }

    const unsubscribeRoom = onSnapshot(roomRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        navigate('/');
        return;
      }
      const roomDetails = docSnapshot.data();
      setRoomName(roomDetails.name); 
    });

    document.title = `${roomName} | TempTalk`;

    const messagesRef = collection(firestore, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy('createdAt'));

    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribeRoom();
      unsubscribeMessages();
    };
  }, [roomId, navigate, roomName]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const userId = Cookies.get('userId') || '';
    const messagesRef = collection(firestore, `rooms/${roomId}/messages`);
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      senderAlias: alias,
      senderId: userId
    });
    setNewMessage('');
  };

  const handleDeleteRoom = async () => {
    try {
      const roomRef = doc(firestore, `rooms/${roomId}`);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.data().adminId === Cookies.get('userId')) {
        await deleteDoc(roomRef);
        navigate('/');
      } else {
        alert("You are not authorized to delete this room.");
      }
    } catch (error) {
      console.error("Error deleting room: ", error);
    }
  };

  return (
    <div className="roomPageContainer">
      <div className="roomContainer">
        <Header roomName={roomName} onDeleteRoom={handleDeleteRoom} />
        <div className="messagesContainer" ref={messagesContainerRef}>
          {messages.map((message) => (
            <p key={message.id} className={Cookies.get('userId') === message.senderId ? "message localMessage" : 'message'}>
              <p className="messageSender">{message.senderAlias}</p>
              <p className="messageContent">{message.text}</p>
            </p>
          ))}
        </div>
        {messages.length === 0 && <p className="noMessages">No messages yet. Be the first to send one.</p>}
        <form onSubmit={sendMessage} className="messageForm">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="messageInput"
          />
          <button type="submit" className="sendMessageButton" disabled={newMessage.trim() === ''}><i className="bi bi-send-fill"></i></button>
        </form>
      </div>
    </div>
  );
}

export default Room;
