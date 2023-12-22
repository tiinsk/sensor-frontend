export const setJWTToken = JWTToken => {
  localStorage.setItem('auth', JWTToken);
};

export const removeJWTToken = () => {
  localStorage.removeItem('auth');
};

export const getJWTToken = () => {
  return localStorage.getItem('auth');
};
export const isLoggedIn = () => {
  return !!localStorage.getItem('auth');
};
