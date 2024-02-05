import { clearStorage, getStorageItem, setStorageItem } from './index';

export const setJWTToken = (JWTToken: string) => {
  setStorageItem('auth', JWTToken);
};

export const removeJWTToken = () => {
  clearStorage();
};

export const getJWTToken = () => {
  return getStorageItem('auth') || '';
};
export const isLoggedIn = () => {
  return !!getStorageItem('auth');
};
