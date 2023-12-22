import { useEffect, useState } from 'react';
import api from '../api/routes';
import { DeviceCard } from '../components/cards/device-card';
import {
  LatestReadingResponse,
  ReadingsResponse,
  StatisticsResponse,
} from '../api/types';
import styled from 'styled-components';
import {
  getDefaultTimeLevel,
  getEndTime,
  getStartTime,
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { getUTCTime } from '../utils/datetime';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacings.s48} ${({ theme }) => theme.spacings.s24};
`;

const DEFAULT_PERIOD = 'day';

export const Home = () => {
  const timeNow = new Date().toISOString();
  const [options, setOptions] = useState<TimeFrameOptions>({
    endTime: getEndTime(timeNow, DEFAULT_PERIOD)!,
    startTime: getStartTime(timeNow, DEFAULT_PERIOD)!,
    timePeriod: DEFAULT_PERIOD,
    valueType: 'temperature',
    level: getDefaultTimeLevel(DEFAULT_PERIOD),
    showMinAndMax: true,
  });

  const [latestData, setLatestData] = useState<LatestReadingResponse[]>([]);
  const [statisticsData, setStatisticsData] = useState<{
    [id: string]: StatisticsResponse | undefined;
  }>({});
  const [readingsData, setReadingsData] = useState<{
    [id: string]: ReadingsResponse | undefined;
  }>({});

  const fetchData = async () => {
    const startTime = getUTCTime(options.startTime);
    const endTime = getUTCTime(options.endTime);
    const [latestResult, statisticsResult, readingsResult] = await Promise.all([
      api.getAllLatest(),
      api.getAllStatistics({
        startTime,
        endTime,
      }),
      api.getAllReadings({
        startTime,
        endTime,
        type: options.valueType || 'temperature',
        level: options.level,
      }),
    ]);
    const statisticsByDevice = statisticsResult?.values.reduce<{
      [id: string]: StatisticsResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    const readingsByDevice = readingsResult?.values.reduce<{
      [id: string]: ReadingsResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    setLatestData(latestResult?.values || []);
    setStatisticsData(statisticsByDevice || {});
    setReadingsData(readingsByDevice || {});
  };

  useEffect(() => {
    fetchData();
  }, [options]);

  return (
    <>
      <TimeFrameSelector
        options={options}
        onChange={newOptions => setOptions(newOptions)}
      />
      <CardGrid>
        {latestData?.map(device => (
          <DeviceCard
            key={device.id}
            options={options}
            latestData={device}
            statisticsData={statisticsData[device.id]}
            readingsData={readingsData[device.id]?.values}
          />
        ))}
      </CardGrid>
    </>
  );
};
