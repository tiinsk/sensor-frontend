import { useState } from 'react';
import styled from 'styled-components';
import { H2 } from '../styled/typography';
import { Button } from '../styled/buttons';
import { Flex } from '../styled/flex';
import { Select } from '../styled/selects';
import { Toggle } from '../styled/inputs/toggle';
import { DateTime } from 'luxon';

interface Options {
  startTime: string;
  endTime: string;
  timePeriod: string;
  valueType: string;
  level: string;
  showMinAndMax: boolean;
}

interface TimeFrameSelectorProps {
  onChange: (newOptions: Options) => void;
}

const StyledTimeFrameSelector = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacings.s16} 0;
  margin-bottom: ${({ theme }) => theme.spacings.s16};
`;

export const TimeFrameSelector = ({ onChange }: TimeFrameSelectorProps) => {
  const endTime = new Date().toISOString();
  const startTime = DateTime.fromISO(endTime).minus({ days: 1 }).toISO();

  const [options, setOptions] = useState<Options>({
    startTime: startTime || endTime,
    endTime,
    timePeriod: 'day',
    valueType: 'temperature',
    level: 'hour',
    showMinAndMax: true,
  });

  const formattedTimeStr = DateTime.fromISO(endTime).toFormat('ccc dd.LL.');

  return (
    <StyledTimeFrameSelector>
      <Flex gap="s8" alignItems="center">
        <H2 mr="s16">{formattedTimeStr}</H2>
        <Button iconLeft="mdiChevronLeft" variant="secondary" />
        <Button iconLeft="mdiChevronRight" variant="secondary" />
      </Flex>
      <Flex gap="s16" alignItems="flex-end">
        <Select
          label="Time period"
          onSelect={(value: string) =>
            setOptions({ ...options, timePeriod: value })
          }
          initialValue="day"
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
        />
        <Select
          label="Graph type"
          onSelect={(value: string) =>
            setOptions({ ...options, valueType: value })
          }
          initialValue="temperature"
          options={[
            { value: 'temperature', label: 'Temperature' },
            { value: 'humidity', label: 'Humidity' },
            { value: 'pressure', label: 'Pressure' },
          ]}
        />
        <Select
          label="Graph level"
          onSelect={(value: string) => setOptions({ ...options, level: value })}
          initialValue="hour"
          options={[
            { value: 'hour', label: 'Hour' },
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
        <Toggle
          name="min-max-toggle"
          text="Min and max values"
          isSelected={options.showMinAndMax}
          onChange={value => setOptions({ ...options, showMinAndMax: value })}
        />
      </Flex>
    </StyledTimeFrameSelector>
  );
};
