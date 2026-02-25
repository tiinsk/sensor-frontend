import * as React from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { PropsWithChildren, useState } from 'react';
import { Reading as ReadingType } from '../../../api/types';
import styled from 'styled-components';
import { Caption3 } from '../typography';
import { DateTime } from 'luxon';
import { TimePeriod, ValueType } from '../../selectors/time-frame-selector';
import { Reading } from '../readings';
import { useGraphSizeContext } from '../../graphs/graph-size-context';

export interface TooltipContent extends ReadingType {
  position: { x: number; y: number };
}

interface TooltipProps {
  tooltipContent?: TooltipContent;
  timePeriod: TimePeriod;
  valueType: ValueType;
}

const StyledTooltip = styled.div`
  position: absolute;

  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
  min-width: ${({ theme }) => theme.spacings.s128};
  pointer-events: none;
`;

const StyledTitle = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  padding: ${({ theme }) => theme.spacings.s8};
`;

const StyledContent = styled.div`
  padding: ${({ theme }) => theme.spacings.s4}
    ${({ theme }) => theme.spacings.s8};
  padding-left: ${({ theme }) => theme.spacings.s4};
`;

const formatDate = (timePeriod: TimePeriod, date?: string) => {
  if (!date) return '';
  const dateTime = DateTime.fromISO(date);
  switch (timePeriod) {
    case 'day':
      return dateTime.toFormat('dd.LL.yyyy HH:mm');
    case 'week':
      return dateTime.toFormat('ccc dd.LL.');
    case 'month':
      return dateTime.toFormat('dd.LL.yyyy');
    case 'year':
      return dateTime.toFormat('MMM');
  }
};

const tooltipMargins = {
  left: 12,
};

export const GraphTooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  tooltipContent,
  timePeriod,
  valueType,
}) => {
  const [position, setPosition] = useState<
    | {
        top: number;
        left: number;
      }
    | undefined
  >(undefined);

  const {
    rootRef,
    height: graphHeight,
    width: graphWidth,
  } = useGraphSizeContext();

  const reposition = (element: HTMLDivElement) => {
    let left = tooltipContent?.position.x;
    let top = tooltipContent?.position.y;

    const tooltipWidth = element?.offsetWidth;
    const tooltipHeight = element?.offsetHeight;
    if (
      left === undefined ||
      top === undefined ||
      tooltipWidth === undefined ||
      tooltipHeight === undefined
    ) {
      if (position) {
        setPosition(undefined);
      }
      return;
    }

    left += tooltipMargins.left;
    top -= tooltipHeight / 2;

    if (left < 0) {
      left = 0;
    }
    if (top < 0) {
      top = 0;
    }

    const right = left + tooltipWidth;
    const bottom = top + tooltipHeight;

    if (right > graphWidth) {
      left -= tooltipWidth + tooltipMargins.left * 2;
    }

    if (bottom > graphHeight) {
      top -= bottom - graphHeight;
    }
    if (position?.left !== left || position?.top !== top) {
      setPosition({ top, left });
    }
  };
  return (
    <>
      {tooltipContent && (
        <FloatingPortal root={rootRef}>
          <StyledTooltip
            role="tooltip"
            ref={reposition}
            style={{
              left: position?.left,
              top: position?.top,
            }}
          >
            <StyledTitle>
              <Caption3>
                {formatDate(timePeriod, tooltipContent.timestamp)}
              </Caption3>
            </StyledTitle>
            <StyledContent>
              <Reading
                variant="avg"
                sizeVariant="small"
                value={tooltipContent.avg}
                unit={valueType}
              />
              <Reading
                variant="max"
                sizeVariant="small"
                value={tooltipContent.max}
                unit={valueType}
              />
              <Reading
                variant="min"
                sizeVariant="small"
                value={tooltipContent.min}
                unit={valueType}
              />
            </StyledContent>
          </StyledTooltip>
        </FloatingPortal>
      )}
    </>
  );
};
