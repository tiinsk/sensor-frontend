import React, { useContext } from 'react';

export interface GraphSizeContextValue {
  width: number;
  height: number;
}

export const GraphSizeContext = React.createContext<GraphSizeContextValue>(
  {} as GraphSizeContextValue
);

export const useGraphSizeContext = () => useContext(GraphSizeContext);
