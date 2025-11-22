import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import axiosInstance from "./axios";

const API_URI = "";


export const loginUser = async (email, password) => {
  const userCredentials = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredentials.user.getIdToken();

  localStorage.setItem("authToken", idToken);
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${idToken}`;

  const response = await axiosInstance.post(`${API_URI}/auth/login`, {
    idToken,
  });

  return response.data.user;
};

export const fetchUser = async () => {
  const response = await axiosInstance.get(`${API_URI}/auth/me`);
 
  return response.data.user;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post(`${API_URI}/auth/logout`);
  return response.data.user;
};

export const FAVerify = async (code) => {
  const response = await axiosInstance.post(`${API_URI}/auth/verify-2fa`, {
    code,
  });
  return response.data.user;
};

export const ForgotPassword = async (email) => {
  const response = await axiosInstance.post(`${API_URI}/auth/forgot-password`, {
    email,
  });
  return response.data;
};

export const ResetPassword = async (token, password) => {
  const response = await axiosInstance.post(`${API_URI}/auth/reset-password`, {
    token,
    password,
  });
  return response.data;
};

export const EditProfile = async (formData) => {
  const response = await axiosInstance.put(
    `${API_URI}/user/profile`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// data-all

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

// buat blogs
export const createBlog = async (formData) => {
  const response = await axiosInstance.post(
    `${API_URI}/blog/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// updateId
export const updateBlog = async (id, formData) => {
  const response = await axiosInstance.put(
    `${API_URI}/blog/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// delete
export const deleteBlog = async (id) => {
  const response = await axiosInstance.delete(`${API_URI}/blog/delete/${id}`);
  return response.data;
};

// testimonials

// getAll
export const getTestimonials = async () => {
  const response = await axiosInstance.get(`${API_URI}/testimoni`);
 
  return response.data;
};

// create
export const createTestimonial = async (formData) => {
  const response = await axiosInstance.post(
    `${API_URI}/testimoni/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// update
export const updateTestimonial = async (id, formData) => {
  const response = await axiosInstance.put(
    `${API_URI}/testimoni/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// delete
export const deleteTestimonial = async (id) => {
  const response = await axiosInstance.delete(
    `${API_URI}/testimoni/delete/${id}`
  );
  return response.data;
};

// Heroes

// getAll
export const getHeroes = async () => {
  const response = await axiosInstance.get(`${API_URI}/hero`);
  
  return response.data;
};

// create Hero
export const createHeroes = async (formData) => {
  const response = await axiosInstance.post(
    `${API_URI}/hero/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// update hero
export const updateHeroes = async (id, formData) => {
  const response = await axiosInstance.put(
    `${API_URI}/hero/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
// delete hero
export const deleteHeroes = async (id) => {
  const response = await axiosInstance.delete(`${API_URI}/hero/delete/${id}`);
  return response.data;
};

// Iklan

// getAll iklan
export const getIklan = async () => {
  const response = await axiosInstance.get(`${API_URI}/iklan`);
 
  return response.data;
};

// createIkaln
export const createIklan = async (formData) => {
  const response = await axiosInstance.post(
    `${API_URI}/iklan/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// updateIklan
export const updateIklan = async (id, formData) => {
  const response = await axiosInstance.put(
    `${API_URI}/iklan/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
 
  return response.data;
};

// delete iklan
export const deleteIklan = async (id) => {
  const response = await axiosInstance.delete(`${API_URI}/iklan/delete/${id}`);
  return response.data;
};

// logo PT

// getAll
export const getLogoPTs = async () => {
  const response = await axiosInstance.get(`${API_URI}/logoPt`);
 
  return response.data;
};

// create Logos
export const createLogoPT = async (formData) => {
  const response = await axiosInstance.post(
    `${API_URI}/logoPt/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// update Logos
export const updateLogoPT = async (id, formData) => {
  const response = await axiosInstance.put(
    `${API_URI}/logoPt/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// delete Logos
export const deleteLogoPT = async (id) => {
  const response = await axiosInstance.delete(`${API_URI}/logoPt/delete/${id}`);
  return response.data;
};
