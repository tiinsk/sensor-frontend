import React, { useContext } from 'react';

export interface RightDrawerContextValue {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const RightDrawerContext = React.createContext<RightDrawerContextValue>(
  {} as RightDrawerContextValue
);

export const useRightDrawerContext = () => useContext(RightDrawerContext);
