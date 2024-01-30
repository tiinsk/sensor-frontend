import { useEffect, useState } from 'react';
import api from '../api/routes';
import { DeviceResponse, LatestReadingResponse } from '../api/types';
import styled from 'styled-components';
import { H2 } from '../components/styled/typography';
import { AdminTable } from '../components/tables/admin-table';

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
  margin-top: ${({ theme }) => theme.spacings.s24};
  margin-bottom: ${({ theme }) => theme.spacings.s24};
`;

export const Admin = () => {
  const [devices, setDevices] = useState<DeviceResponse[]>([]);

  const [latestData, setLatestData] = useState<{
    [id: string]: LatestReadingResponse | undefined;
  }>({});

  const [isLoadingMainContent, setLoadingMainContent] = useState<
    boolean | undefined
  >(undefined);

  const fetchMainContent = async () => {
    setLoadingMainContent(true);
    const [devicesResult, latestResult] = await Promise.all([
      api.getAllDevices({ includeDisabled: true }),
      api.getAllLatest(),
    ]);

    const latestByDevice = latestResult?.values.reduce<{
      [id: string]: LatestReadingResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    setDevices(devicesResult?.values || []);
    setLatestData(latestByDevice || {});
    setLoadingMainContent(false);
  };

  useEffect(() => {
    fetchMainContent();
  }, []);

  return (
    <div>
      <H2>Admin Settings</H2>
      <Card>
        <AdminTable
          devices={devices}
          latestData={latestData}
          isLoading={isLoadingMainContent}
          fetchDevices={() => fetchMainContent()}
        />
      </Card>
    </div>
  );
};
