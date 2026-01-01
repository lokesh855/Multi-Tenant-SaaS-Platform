export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getUser = () => {
  const user = sessionStorage.getItem("user") || localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const isTenantAdmin = () => {
  const user = getUser();
  return user?.role === "tenant_admin";
};

export const isTokenValid = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};