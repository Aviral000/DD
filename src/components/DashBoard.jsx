import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const encryptedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const decryptedUsers = encryptedUsers.map(user => {
      const bytes = CryptoJS.AES.decrypt(user, 'secret-key');
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    });
    setUsers(decryptedUsers);
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  };

  const deleteUser = (username) => {
    if (username === loggedInUser) {
      alert('You cannot delete yourself');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      const updatedUsers = users.filter(user => user.username !== username);
      updateUsers(updatedUsers);
    }
  };

  const editUser = (username) => {
    const userToEdit = users.find(user => user.username === username);
    setEditingUser(userToEdit);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(user => 
      user.username === editingUser.username ? editingUser : user
    );
    updateUsers(updatedUsers);
    setEditingUser(null);
  };

  const updateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    const encryptedUsers = updatedUsers.map(user => 
      CryptoJS.AES.encrypt(JSON.stringify(user), 'secret-key').toString()
    );
    localStorage.setItem('users', JSON.stringify(encryptedUsers));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h2>Welcome, {loggedInUser}!</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>
                <button onClick={() => editUser(user.username)}>Edit</button>
                <button onClick={() => deleteUser(user.username)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-form">
          <h3>Edit User</h3>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>Username:</label>
              <input type="text" name="username" value={editingUser.username} readOnly />
            </div>
            <div>
              <label>First Name:</label>
              <input type="text" name="firstName" value={editingUser.firstName} onChange={handleInputChange} />
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" name="lastName" value={editingUser.lastName} onChange={handleInputChange} />
            </div>
            <div>
              <label>Phone:</label>
              <input type="text" name="phone" value={editingUser.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={editingUser.email} onChange={handleInputChange} />
            </div>
            <div>
              <label>Address:</label>
              <textarea name="address" value={editingUser.address} onChange={handleInputChange} />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}