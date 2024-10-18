import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <FontAwesomeIcon icon={faUserCircle} className="sign-in-icon" />
        <h1>Sign In</h1>
        <form>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <a href="./user.html" className="sign-in-button">Sign In</a>
        </form>
      </section>
    </main>
  );
};

export default SignIn;