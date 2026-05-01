import React, { useState } from 'react';
import { createExpense } from '../api';

const AddExpense = ({ users, onExpenseAdded }) => {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [payerId, setPayerId] = useState('');
  const [involved, setInvolved] = useState([]);
  const [type, setType] = useState('EQUAL');
  const [custom, setCustom] = useState({});

  const toggleInvolved = (id) => {
    setInvolved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!desc || !amt || !payerId || !involved.length) return alert('Fill everything');

    const data = {
      description: desc,
      amount: Number(amt),
      payer: payerId,
      participants: involved,
      splitType: type
    };

    if (type === 'UNEQUAL') {
      data.customSplits = involved.map(id => ({
        user: id,
        amount: Number(custom[id] || 0)
      }));
      const sum = data.customSplits.reduce((acc, s) => acc + s.amount, 0);
      if (Math.abs(sum - data.amount) > 0.01) return alert('Sum mismatch');
    }

    try {
      await createExpense(data);
      setDesc(''); setAmt(''); setPayerId(''); setInvolved([]); setType('EQUAL'); setCustom({});
      onExpenseAdded();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h2>Add Expense</h2>
      <form onSubmit={save}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="number" placeholder="Amount" value={amt} onChange={e => setAmt(e.target.value)} />
          
          <select value={payerId} onChange={e => setPayerId(e.target.value)}>
            <option value="">Who paid?</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>

          <div>
            <p style={{ margin: '0.5rem 0' }}>Who is sharing?</p>
            <div className="user-grid">
              {users.map(u => (
                <label key={u._id} className="checkbox-item">
                  <input type="checkbox" checked={involved.includes(u._id)} onChange={() => toggleInvolved(u._id)} />
                  {u.name}
                </label>
              ))}
            </div>
          </div>

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="EQUAL">Split Equally</option>
            <option value="UNEQUAL">Custom Amount</option>
          </select>

          {type === 'UNEQUAL' && (
            <div className="custom-splits">
              {involved.map(id => (
                <div key={id} className="split-row">
                  <span>{users.find(u => u._id === id)?.name}:</span>
                  <input type="number" value={custom[id] || ''} onChange={e => setCustom({...custom, [id]: e.target.value})} />
                </div>
              ))}
            </div>
          )}

          <button type="submit">Save Expense</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
