import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getTestimonials = async () => {
  const response = await axios.get(`${API_URL}/testimonials`);
  return response.data;
};

export const createTestimonial = async (formData) => {
  const response = await axios.post(`${API_URL}/testimonials`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTestimonial = async (id, formData) => {
  const response = await axios.put(`${API_URL}/testimonials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await axios.delete(`${API_URL}/testimonials/${id}`);
  return response.data;
}; 