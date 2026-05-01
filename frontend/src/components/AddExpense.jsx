import React, { useState } from 'react';
import { createExpense } from '../api';

const AddExpense = ({ users, onExpenseAdded }) => {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [payer, setPayer] = useState('');
  const [involved, setInvolved] = useState([]);
  const [type, setType] = useState('EQUAL');
  const [custom, setCustom] = useState({});

  const toggle = (id) => {
    setInvolved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!desc || !amt || !payer || !involved.length) return alert('Missing info');

    const amount = Number(amt);
    const data = { description: desc, amount, payer, participants: involved, splitType: type };
    
    if (type === 'UNEQUAL') {
      data.customSplits = involved.map(id => ({ user: id, amount: Number(custom[id] || 0) }));
      const sum = data.customSplits.reduce((acc, s) => acc + s.amount, 0);
      if (Math.abs(sum - amount) > 0.01) return alert('Total mismatch');
    }

    try {
      await createExpense(data);
      setDesc(''); setAmt(''); setInvolved([]); setCustom({}); setPayer(''); setType('EQUAL');
      onExpenseAdded();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Failed'));
    }
  };

  return (
    <div className="box">
      <h2>Add Expense</h2>
      <form onSubmit={save}>
        <input placeholder="What?" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="How much?" type="number" value={amt} onChange={e => setAmt(e.target.value)} />
        
        <p>Payer:</p>
        <select value={payer} onChange={e => setPayer(e.target.value)}>
          <option value="">Select...</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>

        <p>Sharing with:</p>
        <div className="user-grid">
          {users.map(u => (
            <label key={u._id} className="checkbox-item">
              <input type="checkbox" checked={involved.includes(u._id)} onChange={() => toggle(u._id)} />
              <span>{u.name}</span>
            </label>
          ))}
        </div>

        <p>Split:</p>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="EQUAL">Equal</option>
          <option value="UNEQUAL">Custom</option>
        </select>

        {type === 'UNEQUAL' && (
          <div className="custom-splits">
            {involved.map(id => (
              <div key={id} className="split-row">
                <span>{users.find(u => u._id === id)?.name}:</span>
                <input 
                  type="number" 
                  value={custom[id] || ''} 
                  onChange={e => setCustom({...custom, [id]: e.target.value})} 
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" style={{ marginTop: '20px', width: '100%' }}>Save</button>
      </form>
    </div>
  );
};

export default AddExpense;
