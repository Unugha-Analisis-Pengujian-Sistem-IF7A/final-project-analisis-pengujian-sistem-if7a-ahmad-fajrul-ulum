import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getHeroSettings = async () => {
  const response = await axios.get(`${API_URL}/hero-settings`);
  return response.data;
};

export const updateHeroSettings = async (formData) => {
  const response = await axios.put(`${API_URL}/hero-settings`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}; 