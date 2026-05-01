import React, { useState } from 'react'
import UserManagement from './components/UserManagement'
import AddExpense from './components/AddExpense'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState(0)

  const onExpenseAdded = () => setRefresh(r => r + 1)

  return (
    <div className="container">
      <header>
        <h1>Smart Expense Sharing</h1>
      </header>
      
      <main>
        <UserManagement onUsersChange={setUsers} />
        
        {users.length >= 2 ? (
          <AddExpense users={users} onExpenseAdded={onExpenseAdded} />
        ) : (
          users.length > 0 && <p className="placeholder">Add at least two users to start adding expenses.</p>
        )}
      </main>
    </div>
  )
}

export default App
