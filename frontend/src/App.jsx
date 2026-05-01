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
        <h1>Expense Sharing</h1>
      </header>
      
      <main className="main-layout">
        <div className="column">
          <div className="box">
            <UserManagement onUsersChange={setUsers} />
          </div>
          
          {users.length >= 2 && (
            <div className="box">
              <AddExpense users={users} onExpenseAdded={onUpdate} />
            </div>
          )}
        </div>
        
        <div className="column">
          {users.length >= 2 ? (
            <Dashboard refresh={refresh} />
          ) : (
            <div className="box">
              <p>Add people to start.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
