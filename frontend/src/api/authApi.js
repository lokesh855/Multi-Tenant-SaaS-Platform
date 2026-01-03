// update the url here foor connection is

import axios from "axios";

export const API = axios.create({

  baseURL: "https://backend-production-ff56.up.railway.app/api" || import.meta.env.VITE_API_URL,

});


export const getProjects = () => {
  return API.get("/projects");
}

export const registerTenant = (data) =>
  API.post("/auth/register-tenant", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const getMe = () => {
  return API.get("/auth/me");
};


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



