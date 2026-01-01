import { API } from "./authApi";

export const getTenants = (page = 1, limit = 10) =>
  API.get(`/tenants?page=${page}&limit=${limit}`);

export const updateTenant = (id, data) =>
  API.put(`/tenants/${id}` , data);
