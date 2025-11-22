import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./users/authSlice";
import dashboardReducer from "./data/dashboardSlice";
import blogReducer from "./data/blogSlice";
import testimonialsReducer from "./data/testimoniSlice";
import heroReducer from "./data/heroSlice";
import iklanReducer from "./data/iklanSlice";
import logoPTReducer from "./data/logoPTSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    blog: blogReducer,
    testimonials: testimonialsReducer,
    hero: heroReducer,
    iklan: iklanReducer,
    logoPTs: logoPTReducer,
  },
});

export default store;
