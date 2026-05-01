import React, { useState } from 'react'
import UserManagement from './components/UserManagement'
import AddExpense from './components/AddExpense'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState(0)

  const onUpdate = () => setRefresh(r => r + 1)

  return (
    <div className="container">
      <header>
        <h1>Smart Expense Sharing</h1>
      </header>
      
      <main>
        <UserManagement onUsersChange={setUsers} />
        
        {users.length >= 2 && (
          <>
            <AddExpense users={users} onExpenseAdded={onUpdate} />
            <Dashboard refresh={refresh} />
          </>
        )}
        
        {users.length === 1 && (
          <p className="placeholder">Add one more user to start.</p>
        )}
      </main>
    </div>
  )
}

export default App
