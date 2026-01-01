import { API } from "./authApi";

export const getMyTasks = (userId) => {
  return API.get(`/projects/tasks?assignedTo=${userId}`);
};


