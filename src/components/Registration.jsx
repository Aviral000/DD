import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export default function Registration() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+91\d{10}$/;
    if (!username.match(/^[A-Za-z]+$/)) {
      return 'Username should only contain alphabets.';
    }
    if (!firstName.match(/^[A-Za-z]+$/)) {
      return 'First name should only contain alphabets.';
    }
    if (!lastName.match(/^[A-Za-z]+$/)) {
      return 'Last name should only contain alphabets.';
    }
    if (!emailRegex.test(email)) {
      return 'Invalid email address.';
    }
    if (!phoneRegex.test(phone)) {
      return 'Phone number should start with +91 and be 10 digits long.';
    }
    if (address.length > 300) {
      return 'Address should not exceed 300 characters.';
    }
    if (!password) {
      return 'Password cannot be empty.';
    }
    return '';
  };

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'secret-key').toString();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    const newUser = { username, firstName, lastName, phone, email, address, password };
    const encryptedUser = encryptData(newUser);
    
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    if (existingUsers.some(user => {
      const decryptedUser = JSON.parse(CryptoJS.AES.decrypt(user, 'secret-key').toString(CryptoJS.enc.Utf8));
      return decryptedUser.username === username;
    })) {
      setError('Username already exists');
      return;
    }
    
    existingUsers.push(encryptedUser);
    
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    setError('');
    alert('Registration successful!');
    setUsername('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPassword('');
    navigate('/login');
  };

  return (
    <div>
      <h1>Registration Page:</h1>
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
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            placeholder="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            placeholder="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            placeholder="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            placeholder="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength="300"
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