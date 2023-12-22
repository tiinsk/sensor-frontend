import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { GraphSizeContext } from './graph-size-context';
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
  const [graphSize, setGraphSize] = useState<{ width: number; height: number }>(
    {
      height: 0,
      width: 0,
    }
  );
  const ref = useRef<HTMLDivElement>(null);

  const resizeGraph = () => {
    const elementWidth = ref.current?.offsetWidth;
    const elementHeight = ref.current?.offsetHeight;
    if (
      elementWidth !== graphSize.width ||
      elementHeight !== graphSize.height
    ) {
      setGraphSize({ width: elementWidth || 0, height: elementHeight || 0 });
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
