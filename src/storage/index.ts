export const getStorageItem = (key: string) => {
  return localStorage.getItem(key);
};

export const setStorageItem = (key: string, item: any) => {
  return localStorage.setItem(
    key,
    typeof item !== 'string' ? JSON.stringify(item) : item
  );
};

export const removeStorageItem = (key: string) => {
  return localStorage.removeItem(key);
};

export const clearStorage = () => {
  return localStorage.clear();
};
