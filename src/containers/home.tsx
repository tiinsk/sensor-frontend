import { useEffect, useState } from 'react';
import api from '../api/routes';
import { DeviceCard } from '../components/cards/device-card';
import { LatestReadingResponse } from '../api/types';
import styled from 'styled-components';
import {
  getEndTime,
  getStartTime,
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';

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

  const fetchData = async () => {
    const [latestResult, extremesResult] = await Promise.all([
      api.getAllLatest(),
      api.getExtremes(),
    ]);
    setLatestData(latestResult?.values || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <TimeFrameSelector
        options={options}
        onChange={newOptions => setOptions(newOptions)}
      />
      <CardGrid>
        {latestData?.map(item => (
          <DeviceCard key={item.id} options={options} latestData={item} />
        ))}
      </CardGrid>
    </>
  );
};
