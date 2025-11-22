import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Konfigurasi default axios
axios.defaults.timeout = 10000;

// Retry interceptor
axios.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }
  config.retryCount = config.retryCount || 0;
  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }
  config.retryCount += 1;
  const backoff = new Promise((resolve) => setTimeout(resolve, config.retryCount * 1000));
  await backoff;
  return axios(config);
});

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

// BLOG
export const getBlogPosts = async () => {
  const res = await axios.get(`${API_URL}/blogs`);
  return res.data;
};

export const createBlogPost = async (postData) => {
  const res = await axios.post(`${API_URL}/blogs`, postData);
  return res.data;
};

export const updateBlogPost = async (id, postData) => {
  const res = await axios.put(`${API_URL}/blogs/${id}`, postData);
  return res.data;
};

export const deleteBlogPost = async (id) => {
  const res = await axios.delete(`${API_URL}/blogs/${id}`);
  return res.data;
};

// TESTIMONIALS
export const getTestimonials = async () => {
  const res = await axios.get(`${API_URL}/testimonials`);
  return res.data;
};

export const createTestimonial = async (testimonialData) => {
  const res = await axios.post(`${API_URL}/testimonials`, testimonialData);
  return res.data;
};

export const updateTestimonial = async (id, testimonialData) => {
  const res = await axios.put(`${API_URL}/testimonials/${id}`, testimonialData);
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await axios.delete(`${API_URL}/testimonials/${id}`);
  return res.data;
};

// HERO
export const getHeroes = async () => {
  const res = await axios.get(`${API_URL}/heroes`);
  return res.data;
};

export const createHero = async (formData) => {
  const res = await axios.post(`${API_URL}/heroes`, formData);
  return res.data;
};

export const updateHero = async (id, formData) => {
  const res = await axios.put(`${API_URL}/heroes/${id}`, formData);
  return res.data;
};

export const deleteHero = async (id) => {
  const res = await axios.delete(`${API_URL}/heroes/${id}`);
  return res.data;
};

// LOGO PT
export const getLogoPTs = async () => {
  const res = await axios.get(`${API_URL}/logo-pts`);
  return res.data;
};

export const createLogoPT = async (formData) => {
  const res = await axios.post(`${API_URL}/logo-pts`, formData);
  return res.data;
};

export const updateLogoPT = async (id, formData) => {
  const res = await axios.put(`${API_URL}/logo-pts/${id}`, formData);
  return res.data;
};

export const deleteLogoPT = async (id) => {
  const res = await axios.delete(`${API_URL}/logo-pts/${id}`);
  return res.data;
};
