import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RoomCreation from './components/RoomCreation';
import Room from './components/Room';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route exact path="/" element={<RoomCreation />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
