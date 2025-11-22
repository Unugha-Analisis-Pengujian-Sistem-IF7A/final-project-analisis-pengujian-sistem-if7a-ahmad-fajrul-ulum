
import axiosInstance from "./axios";

const API_URI = "";


// getAllblogs
export const getBlogs = async () => {
  const response = await axiosInstance.get(`${API_URI}/blog`);
 
  return response.data;
};

// getAllblogId
export const getBlogById = async (id) => {
  const response = await axiosInstance.get(`${API_URI}/blog/${id}`);
  return response.data;
};

// getAll
export const getTestimonials = async () => {
  const response = await axiosInstance.get(`${API_URI}/testimoni`);

  return response.data;
};


// getAll
export const getHeroes = async () => {
  const response = await axiosInstance.get(`${API_URI}/hero`);

  return response.data;
};


// getAll iklan
export const getIklan = async () => {
  const response = await axiosInstance.get(`${API_URI}/iklan`);

  return response.data;
};

// getAll
export const getLogoPTs = async () => {
  const response = await axiosInstance.get(`${API_URI}/logoPt`);

  return response.data;
};

// create Logos



