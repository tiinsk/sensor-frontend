import styled from 'styled-components';
import { Body, H2 } from '../styled/typography';
import { Button } from '../styled/buttons';
import { Flex } from '../styled/flex';
import { Select } from '../styled/selects';
import { Toggle } from '../styled/inputs/toggle';
import { DateTime, DateTimeUnit } from 'luxon';
import React, { PropsWithChildren } from 'react';
import { RightDrawer } from '../styled/menus/right-drawer';
import { useRightDrawerContext } from '../styled/menus/right-drawer-context';

export const DEFAULT_PERIOD = 'month';

export type TimePeriod = Extract<
  DateTimeUnit,
  'year' | 'month' | 'week' | 'day'
>;

export type TimeLevel = '10 minutes' | '30 minutes' | 'day' | 'week' | 'month';

export type Selector = 'timeLevel' | 'timePeriod' | 'valueType';

export type ValueType = 'temperature' | 'humidity' | 'pressure';

export interface TimeFrameOptions {
  timePeriod: TimePeriod;
  offsetFromNow: number;
  valueType?: ValueType;
  level: TimeLevel;
  showMinAndMax: boolean;
}

interface TimeFrameSelectorProps {
  onChange: (newOptions: TimeFrameOptions) => void;
  options: TimeFrameOptions;
  selectors?: Selector[];
}

const StyledTimeFrameSelector = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacings.s16} 0;
  margin-bottom: ${({ theme }) => theme.spacings.s16};

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacings.s16};
    padding-bottom: 0;
    margin-bottom: ${({ theme }) => theme.spacings.s8};
  }
`;

const LeftSideWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacings.s8};
  align-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    width: 100%;
  }
`;

const MobileHiddenRightSide = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacings.s16};
  align-items: flex-end;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

const MobileRightDrawer = styled(RightDrawer)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`;

const getTimePeriodMaxUnitAmount = (timePeriod: DateTimeUnit) => {
  switch (timePeriod) {
    case 'day':
      return { hours: 24 };
    case 'week':
      return { days: 7 };
    case 'month':
      return { days: 31 };
    case 'year':
      return { months: 12 };
    default:
      return { days: 0 };
  }
};

const addTimePeriod = (
  date: string,
  timePeriod: TimePeriod,
  addValue: number
) => {
  return DateTime.fromISO(date)
    .plus({
      year: timePeriod === 'year' ? addValue : 0,
      month: timePeriod === 'month' ? addValue : 0,
      week: timePeriod === 'week' ? addValue : 0,
      day: timePeriod === 'day' ? addValue : 0,
    })
    .toUTC()
    .toISO();
};

export const getStartTime = (offsetFromNow: number, timePeriod: TimePeriod) => {
  const endTime = getEndDateFromNow(offsetFromNow, timePeriod)!;
  const endDateTime = DateTime.fromISO(endTime);
  const endOfPeriod = endDateTime.endOf(timePeriod);

  const isFullTimePeriod = endDateTime
    .toUTC()
    .hasSame(endOfPeriod.toUTC(), 'minute');

  if (offsetFromNow === 0 && !isFullTimePeriod) {
    return DateTime.now().minus(getTimePeriodMaxUnitAmount(timePeriod)).toISO();
  }
  return DateTime.fromISO(endTime).startOf(timePeriod).toISO();
};

export const getGraphStartTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const startTime = getStartTime(offsetFromNow, timePeriod)!;

  return DateTime.fromISO(startTime)
    .minus({
      months: timePeriod === 'year' ? 1 : 0,
      days: ['month', 'week'].includes(timePeriod) ? 1 : 0,
      hours: timePeriod === 'day' ? 30 : 0,
    })
    .toUTC()
    .toISO();
};

export const getDefaultTimeLevel = (
  timePeriod: TimePeriod = DEFAULT_PERIOD
): TimeLevel => {
  switch (timePeriod) {
    case 'day':
      return '30 minutes';
    case 'week':
      return 'day';
    case 'month':
      return 'day';
    case 'year':
      return 'month';
  }
};

export const getEndTime = (offsetFromNow: number, timePeriod: TimePeriod) => {
  const endTime = addTimePeriod(
    DateTime.now().toISO()!,
    timePeriod,
    offsetFromNow
  )!;
  return DateTime.fromISO(endTime).endOf(timePeriod).toISO();
};

export const getEndDateFromNow = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  if (offsetFromNow === 0) {
    return DateTime.now().toUTC().toISO();
  }

  const currentPeriodEnd = getEndTime(0, timePeriod)!;
  return addTimePeriod(currentPeriodEnd, timePeriod, offsetFromNow);
};

export const getGraphEndDateFromNow = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const endOfPeriod = getEndDateFromNow(offsetFromNow, timePeriod)!;

  if (offsetFromNow === 0) {
    return endOfPeriod;
  }

  return DateTime.fromISO(endOfPeriod)
    .plus({
      months: timePeriod === 'year' ? 1 : 0,
      days: ['month', 'week'].includes(timePeriod) ? 1 : 0,
      hours: timePeriod === 'day' ? 30 : 0,
    })
    .toUTC()
    .toISO();
};

const getFormattedDateString = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const endTime = getEndDateFromNow(offsetFromNow, timePeriod)!;
  switch (timePeriod) {
    case 'day':
      return DateTime.fromISO(endTime).toFormat('ccc dd.LL.yy');
    case 'week':
      const startDate = getStartTime(offsetFromNow, timePeriod);
      const start = DateTime.fromISO(startDate!).toFormat('ccc dd.LL.');
      const end = DateTime.fromISO(endTime).toFormat('dd.LL.yy');
      return `${start} - ${end}`;
    case 'month':
      return DateTime.fromISO(endTime).toFormat('LLLL yyyy');
    case 'year':
      return DateTime.fromISO(endTime).toFormat('yyyy');
  }
};

export const TimeFrameSelector = ({
  onChange,
  options,
  selectors = ['timePeriod', 'valueType'],
}: TimeFrameSelectorProps) => {
  const onOptionsChange = (newOptions: Partial<TimeFrameOptions>) => {
    let changedOptions = { ...options, ...newOptions };

    changedOptions = {
      ...changedOptions,
      level: getDefaultTimeLevel(changedOptions.timePeriod),
    };

    onChange(changedOptions);
  };

  const onTimeButtonClick = (direction: -1 | 1) => {
    onOptionsChange({ offsetFromNow: options.offsetFromNow + direction });
  };

  const rightSide = (
    <>
      <Select
        label="Time period"
        onSelect={(value: string) =>
          onOptionsChange({ timePeriod: value as TimePeriod, offsetFromNow: 0 })
        }
        initialValue={options.timePeriod}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
      />
      {selectors?.includes('valueType') && (
        <Select
          label="Graph type"
          onSelect={(value: string) =>
            onOptionsChange({ valueType: value as ValueType })
          }
          initialValue={options.valueType}
          options={[
            { value: 'temperature', label: 'Temperature' },
            { value: 'humidity', label: 'Humidity' },
            { value: 'pressure', label: 'Pressure' },
          ]}
        />
      )}
      {selectors?.includes('timeLevel') && (
        <Select
          label="Graph level"
          onSelect={(value: string) =>
            onOptionsChange({ level: value as TimeLevel })
          }
          initialValue={options.level}
          options={[
            { value: 'hour', label: 'Hour' },
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
      )}
      <Toggle
        name="min-max-toggle"
        text="Min and max values"
        isSelected={options.showMinAndMax}
        onChange={value => onOptionsChange({ showMinAndMax: value })}
      />
    </>
  );

  return (
    <StyledTimeFrameSelector>
      <LeftSideWrapper>
        <Flex gap="s8" alignItems="center" mr="s16">
          <Button
            iconLeft="mdiChevronLeft"
            variant="secondary"
            onClick={() => onTimeButtonClick(-1)}
          />
          <Button
            iconLeft="mdiChevronRight"
            variant="secondary"
            onClick={() => onTimeButtonClick(1)}
            disabled={options.offsetFromNow === 0}
          />
        </Flex>
        <TitleWrapper>
          <H2 mr="s16">
            {getFormattedDateString(options.offsetFromNow, options.timePeriod)}
          </H2>
          <MobileRightDrawer
            buttonProps={{
              iconLeft: 'mdiTuneVertical',
              variant: 'secondary',
            }}
          >
            <MobileDrawerContent>{rightSide}</MobileDrawerContent>
          </MobileRightDrawer>
        </TitleWrapper>
      </LeftSideWrapper>
      <MobileHiddenRightSide>{rightSide}</MobileHiddenRightSide>
    </StyledTimeFrameSelector>
  );
};

const MobileDrawerContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { setOpen } = useRightDrawerContext();
  return (
    <Flex flexDirection="column" p="s16" gap="s16">
      <Flex justifyContent="flex-end" mb="s16">
        <Button
          iconLeft="mdiChevronRight"
          variant="basic"
          onClick={() => setOpen(false)}
        />
      </Flex>
      <Body mb="s8">Graph settings</Body>
      {children}
    </Flex>
  );
};
