import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { GraphSizeContext, GraphSizeContextValue } from './graph-size-context';
import { Caption3Style } from '../../theme/typography';

export const StyledResponsiveFrame = styled.div`
  position: relative;
  height: 100%;

  .unit-text {
    ${Caption3Style};
    color: transparent;
    fill: ${({ theme }) => theme.colors.typography.primary};
  }
`;

export const GraphSizeWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [graphSize, setGraphSize] = useState<GraphSizeContextValue>({
    height: 0,
    width: 0,
    rootRef: ref,
  });
  const resizeGraph = () => {
    const elementWidth = ref.current?.offsetWidth;
    const elementHeight = ref.current?.offsetHeight;
    if (
      elementWidth !== graphSize.width ||
      elementHeight !== graphSize.height
    ) {
      setGraphSize({
        width: elementWidth || 0,
        height: elementHeight || 0,
        rootRef: ref,
      });
    }
  };

  const debouncedWidthListener = debounce(resizeGraph, 200);

  useEffect(() => {
    resizeGraph();

    if (ref.current) {
      window.addEventListener('resize', debouncedWidthListener);
    }

    return () => {
      window.removeEventListener('resize', debouncedWidthListener);
    };
  }, []);

  return (
    <StyledResponsiveFrame ref={ref}>
      <GraphSizeContext.Provider value={graphSize}>
        {children}
      </GraphSizeContext.Provider>
    </StyledResponsiveFrame>
  );
};
