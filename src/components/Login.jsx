import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const encryptedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = encryptedUsers.find((encryptedUser) => {
      const decryptedUser = decryptData(encryptedUser);
      return decryptedUser.username === username && decryptedUser.password === password;
    });
    if (user) {
      localStorage.setItem('loggedInUser', username);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h1>Login Page:</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}