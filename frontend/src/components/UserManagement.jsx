import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../api';

const UserManagement = ({ onUsersChange }) => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
    if (onUsersChange) onUsersChange(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createUser(name);
    setName('');
    fetchUsers();
  };

  return (
    <div className="box">
      <h2>Users</h2>
      <form onSubmit={add} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New Name" />
        <button type="submit">Add</button>
      </form>
      <div className="user-list">
        {users.map(u => <div key={u._id} className="user-item">{u.name}</div>)}
      </div>
    </div>
  );
};

export default UserManagement;
