import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense, getBalances, getSettlements } from '../api';

const Dashboard = ({ refresh }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);

  const load = async () => {
    try {
      const [e, b, s] = await Promise.all([getExpenses(), getBalances(), getSettlements()]);
      setExpenses(e.data);
      setBalances(b.data);
      setSettlements(s.data);
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
    <div style={{ marginTop: '2rem' }}>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2>Balances</h2>
        <div className="list">
          {balances.map(b => (
            <div key={b.userId} className={`item ${b.netBalance >= 0 ? 'plus' : 'minus'}`}>
              <span>{b.name}</span>
              <span>{b.netBalance >= 0 ? `+₹${b.netBalance}` : `-₹${Math.abs(b.netBalance)}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2>Settlements</h2>
        <div className="list">
          {settlements.length ? settlements.map((s, i) => (
            <div key={i} className="item">
              <span><strong>{s.from}</strong> → <strong>{s.to}</strong></span>
              <span>₹{s.amount}</span>
            </div>
          )) : <p className="placeholder">Settled!</p>}
        </div>
      </div>

      <div className="card">
        <h2>Expenses</h2>
        <div className="list">
          {expenses.map(e => (
            <div key={e._id} className="item" style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
              <div>
                <strong>{e.description}</strong>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {e.payer?.name} paid ₹{e.amount}
                </div>
              </div>
              <button onClick={() => remove(e._id)} style={{ padding: '0.3rem 0.6rem', background: '#fee2e2', color: '#ef4444' }}>
                Del
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
