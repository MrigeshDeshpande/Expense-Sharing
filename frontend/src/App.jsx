import React, { useState } from 'react'
import UserManagement from './components/UserManagement'
import './App.css'

function App() {
  const [users, setUsers] = useState([])

  return (
    <div className="container">
      <header>
        <h1>Smart Expense Sharing</h1>
      </header>
      
      <main>
        <UserManagement onUsersChange={setUsers} />
        {users.length === 0 && (
          <p className="placeholder">Add users to get started.</p>
        )}
      </main>
    </div>
  )
}

export default App
