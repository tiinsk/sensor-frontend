import { useEffect, useState } from 'react';
import api from '../api/routes';
import { DeviceCard } from '../components/devices/card';
import { LatestReadingResponse } from '../api/types';
import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacings.s48} ${({ theme }) => theme.spacings.s24};
`;

export const Home = () => {
  const [latestData, setLatestData] = useState<LatestReadingResponse[]>([]);

  const fetchData = async () => {
    const [latestResult, extremesResult] = await Promise.all([
      api.getAllLatest(),
      api.getExtremes(),
    ]);
    setLatestData(latestResult || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CardGrid>
      {latestData?.map(item => (
        <DeviceCard key={item.temperature} latestData={item} />
      ))}
    </CardGrid>
  );
};
