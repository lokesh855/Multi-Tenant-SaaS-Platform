import { API } from "./authApi";

export const getProjects = (status = "") => {
  return API.get(`/projects${status ? `?status=${status}` : ""}`);
};

export const deleteProject = (id) => {
  return API.delete(`/projects/${id}`);
};
