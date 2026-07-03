# Smart Expense Sharing Application

A full-stack MERN application for managing shared expenses with automated settlement optimization.

## Features
- **User Management**: Add and list participants.
- **Expense Tracking**: Add expenses with Equal or Unequal splits.
- **Dynamic Balances**: Real-time calculation of net balances from expense history.
- **Settlement Optimization**: Greedy algorithm to minimize the number of transactions required to settle all debts.
- **Brutalist UI**: High-contrast, minimalist design for clarity and performance.

## Design Decisions

### 1. Derived Balances vs. Persistent State
We do **not** store net balances in the database. Instead, balances are computed on-the-fly by aggregating all expenses.
- **Why**: This ensures data integrity and eventual consistency. Storing balances separately introduces the risk of "desync" (e.g., if an expense is deleted but the balance isn't updated). Computing from the source of truth (expenses) is more robust.

### 2. Settlement Strategy (Greedy Algorithm)
To minimize transactions, we use a greedy approach:
- **Logic**: Match the largest debtor with the largest creditor.
- **Why**: This quickly settles large amounts and typically results in fewer total transactions compared to simple one-to-one matching.

### 3. Precision Handling
Financial calculations in JavaScript are prone to floating-point errors (e.g., `0.1 + 0.2 !== 0.3`).
- **Solution**: We force rounding to 2 decimal places at every step using `Number(val.toFixed(2))`. In equal splits, any remaining "penny" from rounding is automatically assigned to the first participant to ensure the total always adds up exactly.

### 4. Layered Architecture
The backend follows a **Controller-Service-Model** pattern.
- **Why**: This separates concerns—Controllers handle HTTP logic, Services handle business logic, and Models handle data schema. This makes the codebase testable and maintainable.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` with `MONGO_URI` and `PORT`.
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
