import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '../styles/Header.css';

function Header({ roomName, onDeleteRoom }) {
    const [alias, setAlias] = useState('');
    const [showAliasForm, setShowAliasForm] = useState(false);
    const navigate = useNavigate();
  
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
      setShowAliasForm(false);
    };

    const copyUrl = () => {
      const url = window.location.href;

      navigator.clipboard.writeText(url).then(function() {
      }, function(err) {
        console.error('Could not copy URL: ', err);
      });
    };  
  
    return (
        <nav className="navbarContainer">
          <div className="titleSection">
            <Menu menuButton={<MenuButton className="menu-button"><i className="bi bi-three-dots-vertical"></i></MenuButton>}>
              <MenuItem onClick={copyUrl}>Copy URL</MenuItem>
              <MenuItem onClick={onDeleteRoom}>Delete Room</MenuItem>
              <MenuItem onClick={() => navigate('/')}>New Room</MenuItem>
            </Menu>
            <p className='roomName'>{roomName}</p>
          </div>
          <form onSubmit={handleSubmit} className="aliasForm">
            {!showAliasForm && <p className="alias">{alias}</p>}
            {showAliasForm && <input
              type="text"
              value={alias}
              onChange={handleAliasChange}
              onBlur={handleSubmit}
              placeholder="Alias"
              className="aliasInput"
              autoFocus
            />}
            {!showAliasForm && <button onClick={() => setShowAliasForm(!showAliasForm)} className="aliasButton"><i className="bi bi-pencil-fill"></i></button>}
          </form>
        </nav>
    );
}
  
export default Header;
