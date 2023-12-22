import styled from 'styled-components';
import { Body, Caption2, H2 } from '../styled/typography';
import { Button } from '../styled/buttons';
import { Flex } from '../styled/flex';
import { Select } from '../styled/selects';
import { Toggle } from '../styled/inputs/toggle';
import { DateTime, DateTimeUnit } from 'luxon';
import { RightNav } from '../nav/right-nav';
import React, { PropsWithChildren } from 'react';
import { RightDrawer } from '../styled/menus/right-drawer';
import { useRightDrawerContext } from '../styled/menus/right-drawer-context';

export type TimePeriod = Extract<
  DateTimeUnit,
  'year' | 'month' | 'week' | 'day'
>;

export type TimeLevel = '10 minutes' | '30 minutes' | 'day' | 'week' | 'month';

export type Selector = 'timeLevel' | 'timePeriod' | 'valueType';

export type ValueType = 'temperature' | 'humidity' | 'pressure';

export interface TimeFrameOptions {
  startTime: string;
  endTime: string;
  timePeriod: TimePeriod;
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

export const getStartTime = (endTime: string, timePeriod: DateTimeUnit) => {
  return DateTime.fromISO(endTime).startOf(timePeriod).toISO();
};

export const getEndTime = (endTime: string, timePeriod: DateTimeUnit) => {
  const now = DateTime.now();
  let endDateTime = DateTime.fromISO(endTime);

  if (endDateTime > now) {
    endDateTime = now;
  }

  return endDateTime.endOf(timePeriod).toISO();
};

export const getDefaultTimeLevel = (timePeriod: TimePeriod): TimeLevel => {
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

export const TimeFrameSelector = ({
  onChange,
  options,
  selectors = ['timePeriod', 'valueType'],
}: TimeFrameSelectorProps) => {
  const getFormattedDateString = () => {
    if (options.timePeriod === 'day') {
      return DateTime.fromISO(options.endTime).toFormat('ccc dd.LL.yy');
    } else if (options.timePeriod === 'week') {
      const startDate = getStartTime(options.endTime, options.timePeriod);
      const start = DateTime.fromISO(startDate!).toFormat('ccc dd.LL.');
      const end = DateTime.fromISO(options.endTime).toFormat('dd.LL.yy');
      return `${start} - ${end}`;
    } else if (options.timePeriod === 'month') {
      return DateTime.fromISO(options.endTime).toFormat('LLLL yyyy');
    } else if (options.timePeriod === 'year') {
      return DateTime.fromISO(options.endTime).toFormat('yyyy');
    }
  };

  const onOptionsChange = (newOptions: Partial<TimeFrameOptions>) => {
    let changedOptions = { ...options, ...newOptions };

    const newEndTime = getEndTime(
      changedOptions.endTime,
      changedOptions.timePeriod
    );

    const startTime = getStartTime(newEndTime!, changedOptions.timePeriod);

    changedOptions = {
      ...changedOptions,
      level: getDefaultTimeLevel(changedOptions.timePeriod),
      startTime: startTime!,
      endTime: newEndTime!,
    };

    onChange(changedOptions);
  };

  const onTimeButtonClick = (direction: -1 | 1) => {
    const newEndTime = DateTime.fromISO(options.endTime)
      .plus({
        year: options.timePeriod === 'year' ? direction : 0,
        month: options.timePeriod === 'month' ? direction : 0,
        week: options.timePeriod === 'week' ? direction : 0,
        day: options.timePeriod === 'day' ? direction : 0,
      })
      .toUTC()
      .toISO();

    onOptionsChange({ ...options, endTime: newEndTime! });
  };

  const rightSide = (
    <>
      <Select
        label="Time period"
        onSelect={(value: string) =>
          onOptionsChange({ timePeriod: value as TimePeriod })
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
          />
        </Flex>
        <TitleWrapper>
          <H2 mr="s16">{getFormattedDateString()}</H2>
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
