import React, { useState } from 'react';
import classNames from 'classnames';
import { registerUser, signInUser } from './helpers/firebase.js';
import './Login.css';

const Login = () => {
  const values = ['Sign in', 'Sign up'];
  const [toggleIndex, setToggleIndex] = useState(0);
  const redirectUser = () => {
    const data = null; // populate data (email, password)
    toggleIndex ? signInUser(data) : registerUser(data);
    // redirection
  };
  return (
    <div className="login">
      <div className="options-container">
        {values.map((item, index) => (
          <span
            className={classNames('option', toggleIndex === index && 'selected')}
            onClick={() => setToggleIndex(index)}
          >
            {item}
          </span>
        ))}
      </div>
      <form className="login-form" onSubmit={redirectUser}>
        <input placeholder="username" type="text" readOnly />
        <input placeholder="email@email.com" type="text" readOnly />
        <button type="submit" value={values[toggleIndex]}>
          {values[toggleIndex]}
        </button>
      </form>
    </div>
  );
};

export default Login;
