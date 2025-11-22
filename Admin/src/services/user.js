// api.js
import axios from 'axios';

const API_URL = "http://localhost:8000/api"; // Replace with your API URL

// USERS
export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await axios.post(`${API_URL}/users`, userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await axios.put(`${API_URL}/users/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/users/${id}`);
  return res.data;
};
