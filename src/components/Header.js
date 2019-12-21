import React from 'react';
import './Header.css';

const Header = ({ setModalState }) => {
  return (
    <header className="main-title">
      <h1>💩 🤓 💬</h1>
      <button onClick={() => setModalState((state) => !state)} className="main-upload-button">
        Upload!
      </button>
    </header>
  );
};

export default Header;
