import { useEffect, useState } from 'react';
import api from '../api/routes';
import { DeviceCard } from '../components/cards/device-card';
import { LatestReadingResponse, StatisticsResponse } from '../api/types';
import styled from 'styled-components';
import {
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

export const Home = () => {
  const timeNow = new Date().toISOString();
  const [options, setOptions] = useState<TimeFrameOptions>({
    endTime: getEndTime(timeNow, 'day')!,
    startTime: getStartTime(timeNow, 'day')!,
    timePeriod: 'day',
    valueType: 'temperature',
    level: 'hour',
    showMinAndMax: true,
  });

  const [latestData, setLatestData] = useState<LatestReadingResponse[]>([]);
  const [statisticsData, setStatisticsData] = useState<{
    [id: string]: StatisticsResponse | undefined;
  }>({});

  const fetchData = async () => {
    const [latestResult, statisticsResult] = await Promise.all([
      api.getAllLatest(),
      api.getAllStatistics({
        startTime: getUTCTime(options.startTime),
        endTime: getUTCTime(options.endTime),
      }),
    ]);
    const statisticsByDevice = statisticsResult?.values.reduce<{
      [id: string]: StatisticsResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    setLatestData(latestResult?.values || []);
    setStatisticsData(statisticsByDevice || {});
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
          />
        ))}
      </CardGrid>
    </>
  );
};
