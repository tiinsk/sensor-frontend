import React, { useEffect, useState } from 'react';
import api from '../api/routes';
import { useParams } from 'react-router-dom';
import {
  LatestReadingResponse,
  Statistics,
  StatisticsResponse,
} from '../api/types';
import { Flex } from '../components/styled/flex';
import { H2 } from '../components/styled/typography';
import { Reading } from '../components/styled/readings';
import { Tag } from '../components/styled/tag';
import { DateTime } from 'luxon';
import { getTimeAgoString, getUTCTime } from '../utils/datetime';
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

  const [statisticsData, setStatisticsData] = useState<{
    day: Statistics | undefined;
    week: Statistics | undefined;
    month: Statistics | undefined;
  }>({ day: undefined, week: undefined, month: undefined });

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      const now = new Date().toISOString();
      const [latest, statisticsDay, statisticsWeek, statisticsMonth] =
        await Promise.all([
          api.getDeviceLatestReadings(id),
          api.getAllDeviceStatistics({
            startTime: getUTCTime(getStartTime(now, 'day')!),
            endTime: getUTCTime(getEndTime(now, 'day')!),
            deviceId: id,
          }),
          api.getAllDeviceStatistics({
            startTime: getUTCTime(getStartTime(now, 'week')!),
            endTime: getUTCTime(getEndTime(now, 'week')!),
            deviceId: id,
          }),
          api.getAllDeviceStatistics({
            startTime: getUTCTime(getStartTime(now, 'month')!),
            endTime: getUTCTime(getEndTime(now, 'month')!),
            deviceId: id,
          }),
        ]);
      if (latest) {
        setLatestData(latest);
      }

      setStatisticsData({
        day: statisticsDay?.statistics,
        week: statisticsWeek?.statistics,
        month: statisticsMonth?.statistics,
      });
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
          day={statisticsData.day?.temperature || {}}
          week={statisticsData.week?.temperature || {}}
          month={statisticsData.month?.temperature || {}}
        />
        <AverageCard
          title="Humidity"
          unit="humidity"
          day={statisticsData.day?.humidity || {}}
          week={statisticsData.week?.humidity || {}}
          month={statisticsData.month?.humidity || {}}
        />
        <AverageCard
          title="Pressure"
          unit="pressure"
          day={statisticsData.day?.pressure || {}}
          week={statisticsData.week?.pressure || {}}
          month={statisticsData.month?.pressure || {}}
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
