import { getStorageItem, setStorageItem } from './index';

type Theme = 'light' | 'dark';

export const setThemeToStorage = (theme: Theme) => {
  setStorageItem('theme', theme);
};

export const getThemeFromStorage = (): Theme | undefined => {
  return getStorageItem('theme') as Theme;
};
