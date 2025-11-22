import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getBlogs = async () => {
  const response = await axios.get(`${API_URL}/blogs`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await axios.post(`${API_URL}/blogs`, blogData);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await axios.put(`${API_URL}/blogs/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await axios.delete(`${API_URL}/blogs/${id}`);
  return response.data;
}; 