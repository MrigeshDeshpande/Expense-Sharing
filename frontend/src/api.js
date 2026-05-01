import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getUsers = () => axios.get(`${API_URL}/users`);
export const createUser = (name) => axios.post(`${API_URL}/users`, { name });

export const getExpenses = () => axios.get(`${API_URL}/expenses`);
export const createExpense = (data) => axios.post(`${API_URL}/expenses`, data);
export const deleteExpense = (id) => axios.delete(`${API_URL}/expenses/${id}`);

export const getBalances = () => axios.get(`${API_URL}/balances`);
export const getSettlements = () => axios.get(`${API_URL}/balances/settlements`);
