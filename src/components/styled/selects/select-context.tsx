import { useInteractions } from '@floating-ui/react';
import React from 'react';

export interface SelectContextValue {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  handleSelect: (index: number | null, value: string | null) => void;
}

export const SelectContext = React.createContext<SelectContextValue>(
  {} as SelectContextValue
);
