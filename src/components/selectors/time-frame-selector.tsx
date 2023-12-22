import styled from 'styled-components';
import { H2 } from '../styled/typography';
import { Button } from '../styled/buttons';
import { Flex } from '../styled/flex';
import { Select } from '../styled/selects';
import { Toggle } from '../styled/inputs/toggle';
import { DateTime, DateTimeUnit } from 'luxon';

export type TimePeriod = Extract<
  DateTimeUnit,
  'year' | 'month' | 'week' | 'day'
>;

export type TimeLevel = Extract<
  DateTimeUnit,
  'minute' | 'day' | 'week' | 'month'
>;

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
      return 'minute';
    case 'week':
      return 'day';
    case 'month':
      return 'week';
    case 'year':
      return 'month';
  }
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

  return (
    <StyledTimeFrameSelector>
      <Flex gap="s8" alignItems="center">
        <H2 mr="s16">{getFormattedDateString()}</H2>
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
      <Flex gap="s16" alignItems="flex-end">
        <Select
          label="Time period"
          onSelect={(value: string) =>
            onOptionsChange({ timePeriod: value as TimePeriod })
          }
          initialValue="day"
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
            initialValue="temperature"
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
            initialValue="hour"
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
      </Flex>
    </StyledTimeFrameSelector>
  );
};
