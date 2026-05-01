import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense, getBalances, getSettlements } from '../api';

const Dashboard = ({ refresh }) => {
  const [data, setData] = useState({ expenses: [], balances: [], settlements: [] });

  const load = async () => {
    try {
      const [e, b, s] = await Promise.all([getExpenses(), getBalances(), getSettlements()]);
      setData({ expenses: e.data, balances: b.data, settlements: s.data });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [refresh]);

  const remove = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await deleteExpense(id);
      load();
    } catch (err) {
      alert('Error');
    }
  };

  return (
    <div>
      <div className="box">
        <h2>Balances</h2>
        {data.balances.map(b => (
          <div key={b.userId} className={`item ${b.netBalance >= 0 ? 'plus' : 'minus'}`}>
            <span>{b.name}</span>
            <span>₹{b.netBalance.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="box">
        <h2>Settle Up</h2>
        {data.settlements.map((s, i) => (
          <div key={i} className="item">
            <span>{s.from} owes {s.to}</span>
            <span>₹{s.amount.toFixed(2)}</span>
          </div>
        ))}
        {!data.settlements.length && <p>All clear!</p>}
      </div>

      <div className="box">
        <h2>History</h2>
        {data.expenses.map(e => (
          <div key={e._id} className="item" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block' }}>{e.description}</strong>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>
                {e.payer?.name} paid ₹{e.amount}
              </span>
            </div>
            <button onClick={() => remove(e._id)} style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
              DEL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
