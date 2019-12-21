import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { initializeFirebase, fetchDatabaseData } from './helpers/api.js';
import Header from './components/Header';
import './App.css';

import Upload from './components/Upload';

const App = () => {
  const [database, setDatabase] = useState([]);
  // TODO: use state management library to handle these
  const [modalState, setModalState] = useState(false);
  const { firebase } = window;

  useEffect(() => {
    async function init() {
      await initializeFirebase();
      const db = await fetchDatabaseData();
      setDatabase(db ? [db] : []);
    }
    init();
  }, [firebase]);

  return (
    <div className="app-container">
      <Helmet>
        <title>Shit Devs Say</title>
      </Helmet>
      <Header setModalState={setModalState} />
      <div className="posts-container">
        {database.length ? (
          Object.entries(database[0]).map(([key, { title, image }]) => (
            <div className="single-post-container" key={key}>
              <div className="post-inner">
                <h1>{title}</h1>
                <figure style={{ backgroundImage: `url(${image})` }}></figure>
              </div>
            </div>
          ))
        ) : (
          <div />
        )}
      </div>
      {modalState && (
        <div className="modal-background">
          <Upload setModalState={setModalState} />
        </div>
      )}
    </div>
  );
};

export default App;
