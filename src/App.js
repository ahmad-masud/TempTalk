import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RoomCreation from './components/RoomCreation';
import Room from './components/Room';
import Cookies from 'js-cookie';
import './styles/App.css';

function App() {
  useEffect(() => {
    if (!Cookies.get('userid')) {
      Cookies.set('userId', Math.random().toString(36).substring(7), { expires: 7 });
    }
  }, []);

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
