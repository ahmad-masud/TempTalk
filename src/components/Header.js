import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ roomName, onDeleteRoom }) {
    const [alias, setAlias] = useState('');
    const [icon, setIcon] = useState('bi bi-copy');
  
    useEffect(() => {
      const storedAlias = Cookies.get('userAlias');
      if (storedAlias) {
        setAlias(storedAlias);
      }
    }, []);
  
    const handleAliasChange = (event) => {
      setAlias(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      Cookies.set('userAlias', alias, { expires: 7 });
    };

    const copyUrl = () => {
      const url = window.location.href;

      navigator.clipboard.writeText(url).then(function() {
        setIcon("bi bi-check-lg");
        setTimeout(function() {
          setIcon("bi bi-copy");
        }, 2000);
      }, function(err) {
        console.error('Could not copy URL: ', err);
      });
    };  
  
    return (
        <nav className="navbarContainer">
          <div className="logoSection">
            <p className='roomName'>{roomName}</p>
          </div>
          <form onSubmit={handleSubmit} className="aliasForm">
            <input
              type="text"
              value={alias}
              onChange={handleAliasChange}
              placeholder="Alias"
              className="aliasInput"
            />
            <button type="submit" className="aliasButton">Set</button>
          </form>
          <div className="header-buttons">
            <button aria-label="copy url" className="header-button" onClick={copyUrl}><i className={icon}></i></button>
            <button aria-label="delete room" className="header-button" onClick={onDeleteRoom}><i className="bi bi-trash3"></i></button>
            <Link to="/" aria-label="new room" className="header-button"><i className="bi bi-plus-lg"></i></Link>
          </div>
        </nav>
    );
}
  
export default Header;
