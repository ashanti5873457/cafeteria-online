export const getUser = () => {
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("usuario");
};