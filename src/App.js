import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { initializeFirebase, fetchDatabaseData, writeToDatabase } from './helpers/firebase.js';
import './App.css';

const App = () => {
  const [database, setDatabase] = useState([]);
  const [url, setUrl] = useState('');
  const { firebase } = window;

  useEffect(() => {
    async function init() {
      await initializeFirebase();
      const db = await fetchDatabaseData();
      setDatabase(db ? [db] : []);
    }
    init();
  }, [firebase]);

  const submitPost = () => {
    writeToDatabase(url);
    setUrl('');
  };

  return (
    <div>
      <Helmet>
        <title>Shit Devs Say</title>
      </Helmet>
      <h1 className="main-title">💩 🤓 💬</h1>
      {database.length ? (
        Object.entries(database[0]).map(([key, { title, image }]) => (
          <div className="post-container" key={key}>
            <div className="post-inner">
              <h1>{title}</h1>
              <figure style={{ backgroundImage: `url(${image})` }}></figure>
            </div>
          </div>
        ))
      ) : (
        <div />
      )}
      <div className="image-submission">
        <hr />
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter the url of your image here"
        />
        <div className="image-submit" onClick={submitPost}>
          Submit
        </div>
      </div>
    </div>
  );
};

export default App;
