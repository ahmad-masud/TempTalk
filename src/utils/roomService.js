// roomService.js
import { firestore } from '../config/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const createRoom = async (roomName, roomAdminId) => {
  const roomRef = await addDoc(collection(firestore, "rooms"), {
    name: roomName,
    adminId: roomAdminId,
    createdAt: serverTimestamp(), 
  });
  return roomRef.id;
};
