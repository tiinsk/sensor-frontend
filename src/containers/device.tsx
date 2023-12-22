import React, { useEffect, useState } from 'react';
import api from '../api/routes';
import { useParams } from 'react-router-dom';
import { ExtremeResponse, LatestReadingResponse } from '../api/types';
import { Flex } from '../components/styled/flex';
import { H2 } from '../components/styled/typography';
import { Reading } from '../components/styled/readings';
import { Tag } from '../components/styled/tag';
import { DateTime } from 'luxon';
import { getTimeAgoString } from '../utils/datetime';
import { AverageCard } from '../components/cards/average-card';
import {
  getEndTime,
  getStartTime,
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { Box } from '../components/styled/box';

export const Device = () => {
  const timeNow = new Date().toISOString();
  const [options, setOptions] = useState<TimeFrameOptions>({
    endTime: getEndTime(timeNow, 'day')!,
    startTime: getStartTime(timeNow, 'day')!,
    timePeriod: 'day',
    valueType: 'temperature',
    level: 'hour',
    showMinAndMax: true,
  });
  const [latestData, setLatestData] = useState<
    LatestReadingResponse | undefined
  >(undefined);

  const [extremeData, setExtremeData] = useState<ExtremeResponse | undefined>(
    undefined
  );

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      const [latest, extremes] = await Promise.all([
        api.getDeviceLatestReadings(id),
        api.getAllDeviceExtremes(id),
      ]);
      if (latest) {
        setLatestData(latest);
      }
      if (extremes) {
        setExtremeData(extremes);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const timeDiff = latestData?.reading.created_at
    ? Math.abs(
        DateTime.fromISO(latestData?.reading.created_at).diffNow('minutes')
          .minutes
      )
    : 0;
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="flex-end" mb="s16">
        <H2 mb="s4">{latestData?.name}</H2>
        <Flex flexDirection="column" alignItems="flex-end">
          {latestData?.reading.created_at && (
            <Tag
              variant={tagVariant}
              text={getTimeAgoString(latestData.reading.created_at)}
            />
          )}
          <Flex gap="s16">
            {latestData?.reading.temperature && (
              <Reading
                value={latestData?.reading.temperature}
                unit="temperature"
              />
            )}
            {latestData?.reading.humidity && (
              <Reading value={latestData?.reading.humidity} unit="humidity" />
            )}
            {latestData?.reading.pressure && (
              <Reading value={latestData?.reading.pressure} unit="pressure" />
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex gap="s16">
        <AverageCard
          title="Temperature"
          unit="temperature"
          day={{}}
          week={{
            min: extremeData?.min_temperature_week,
            max: extremeData?.max_temperature_week,
          }}
          month={{
            min: extremeData?.min_temperature_month,
            max: extremeData?.max_temperature_month,
          }}
        />
        <AverageCard
          title="Humidity"
          unit="humidity"
          day={{}}
          week={{
            min: extremeData?.min_humidity_week,
            max: extremeData?.max_humidity_week,
          }}
          month={{
            min: extremeData?.min_humidity_month,
            max: extremeData?.max_humidity_month,
          }}
        />
        <AverageCard
          title="Pressure"
          unit="pressure"
          day={{}}
          week={{
            min: extremeData?.min_pressure_week,
            max: extremeData?.max_pressure_week,
          }}
          month={{
            min: extremeData?.min_pressure_month,
            max: extremeData?.max_pressure_month,
          }}
        />
      </Flex>
      <Box mt="s16">
        <TimeFrameSelector
          options={options}
          onChange={newOptions => setOptions(newOptions)}
        />
      </Box>
    </div>
  );
};
