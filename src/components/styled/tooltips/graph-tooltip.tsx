import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useRole,
  useInteractions,
  FloatingPortal,
  useClientPoint,
} from '@floating-ui/react';
import { PropsWithChildren } from 'react';
import { ReadingValue } from '../../../api/types';
import styled from 'styled-components';
import { Caption3 } from '../typography';
import { DateTime } from 'luxon';
import { TimePeriod, ValueType } from '../../selectors/time-frame-selector';
import { Reading } from '../readings';

export interface TooltipContent {
  date: string;
  reading: ReadingValue;
  position: { x: number; y: number };
}

interface TooltipProps {
  tooltipContent?: TooltipContent;
  timePeriod: TimePeriod;
  valueType: ValueType;
}

const StyledTooltip = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
  min-width: ${({ theme }) => theme.spacings.s96};
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

export const GraphTooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  tooltipContent,
  timePeriod,
  valueType,
}) => {
  const { refs, floatingStyles, context } = useFloating({
    open: !!tooltipContent,
    placement: 'right',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(16),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
    ],
  });

  const clientPoint = useClientPoint(context, {
    enabled: true,
    x: tooltipContent?.position?.x,
    y: tooltipContent?.position?.y,
  });

  const role = useRole(context, { role: 'tooltip' });

  const { getFloatingProps } = useInteractions([clientPoint, role]);

  return (
    <FloatingPortal>
      {tooltipContent && (
        <StyledTooltip
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <StyledTitle>
            <Caption3>{formatDate(timePeriod, tooltipContent.date)}</Caption3>
          </StyledTitle>
          <StyledContent>
            <Reading
              variant="avg"
              sizeVariant="small"
              value={tooltipContent.reading.avg}
              unit={valueType}
            />
            <Reading
              variant="max"
              sizeVariant="small"
              value={tooltipContent.reading.max}
              unit={valueType}
            />
            <Reading
              variant="min"
              sizeVariant="small"
              value={tooltipContent.reading.max}
              unit={valueType}
            />
          </StyledContent>
        </StyledTooltip>
      )}
    </FloatingPortal>
  );
};
