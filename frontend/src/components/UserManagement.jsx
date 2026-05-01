import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../api';
import { UserPlus, Users } from 'lucide-react';

const UserManagement = ({ onUsersChange }) => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
      if (onUsersChange) onUsersChange(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createUser(name);
      setName('');
      fetchUsers();
    } catch (err) {
      alert('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2><Users size={20} /> User Management</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          <UserPlus size={16} /> Add User
        </button>
      </form>
      
      <div className="user-list">
        {users.map(user => (
          <div key={user._id} className="user-item">
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
