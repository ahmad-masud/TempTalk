// roomService.js
import { firestore } from '../config/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const createRoom = async (roomName) => {
  const roomRef = await addDoc(collection(firestore, "rooms"), {
    name: roomName, // Store the room name
    createdAt: serverTimestamp(), // Use server timestamp for the creation time
  });
  return roomRef.id; // Returns the newly created room's ID
};
