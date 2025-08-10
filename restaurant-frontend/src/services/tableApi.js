import axios from 'axios';

// Create a reusable axios instance using your .env config
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 📥 Fetch all tables
export const fetchTables = () => API.get('/tables');

// ➕ Add a new table
export const addTable = (data) => API.post('/tables', data);

// 🔄 Update a table by ID
export const updateTable = (id, data) => API.put(`/tables/${id}`, data);

// ❌ Delete a table by ID
export const deleteTable = (id) => API.delete(`/tables/${id}`);

// 📋 Get table details by ID
export const getTableById = (id) => API.get(`/tables/${id}`);

// 📊 Get tables filtered by status (available, occupied, reserved, merged)
export const getTablesByStatus = (status) => API.get(`/tables/status/${status}`);

export const updateTableStatus = (id, status) =>
  API.put(`/tables/${id}/status`, { status });

