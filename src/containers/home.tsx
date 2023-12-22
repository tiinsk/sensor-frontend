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
  DEFAULT_PERIOD,
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { Flex } from '../components/styled/flex';
import { GraphLoading } from '../assets/loading/graph-loading';
import {
  getDefaultTimeLevel,
  getTimeFrame,
} from '../components/selectors/time-frames';

const CARD_MIN_WIDTH = '450px';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${CARD_MIN_WIDTH}, 1fr));
  gap: ${({ theme }) => theme.spacings.s48} ${({ theme }) => theme.spacings.s24};
  margin-bottom: ${({ theme }) => theme.spacings.s48};

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacings.s16};
  }
`;

interface SavedDevice {
  id: string;
  name: string;
}

const getLocalstorageDevices = () => {
  const savedDevices = localStorage.getItem('devices');
  return savedDevices ? JSON.parse(savedDevices) : [];
};

const setLocalstorageDevices = (devices: SavedDevice[]) => {
  localStorage.setItem('devices', JSON.stringify(devices));
};

export const Home = () => {
  const [options, setOptions] = useState<TimeFrameOptions>(() => ({
    offsetFromNow: 0,
    timePeriod: DEFAULT_PERIOD,
    valueType: 'temperature',
    level: getDefaultTimeLevel(),
    showMinAndMax: true,
  }));

  const [devices, setDevices] = useState<SavedDevice[]>(
    getLocalstorageDevices()
  );

  const [isLoadingMainContent, setLoadingMainContent] = useState<
    boolean | undefined
  >(undefined);
  const [isLoadingReadings, setLoadingReadings] = useState<boolean | undefined>(
    undefined
  );

  const [latestData, setLatestData] = useState<{
    [id: string]: LatestReadingResponse | undefined;
  }>({});
  const [statisticsData, setStatisticsData] = useState<{
    [id: string]: StatisticsResponse | undefined;
  }>({});
  const [readingsData, setReadingsData] = useState<{
    [id: string]: ReadingsResponse | undefined;
  }>({});

  const saveDevicesToLocalStorage = (latestData: LatestReadingResponse[]) => {
    const devices = latestData.map(device => ({
      id: device.id,
      name: device.name,
    }));
    setLocalstorageDevices(devices);
    setDevices(devices);
  };

  const fetchReadings = async () => {
    const { graphStartTime, graphEndTime } = getTimeFrame(options);
    setLoadingReadings(true);
    const [statisticsResult, readingsResult] = await Promise.all([
      api.getAllStatistics({
        startTime: graphStartTime,
        endTime: graphEndTime,
      }),
      api.getAllReadings({
        startTime: graphStartTime,
        endTime: graphEndTime,
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

    setStatisticsData(statisticsByDevice || {});
    setReadingsData(readingsByDevice || {});
    setLoadingReadings(false);
  };

  const fetchData = async () => {
    setLoadingMainContent(true);
    const [latestResult] = await Promise.all([api.getAllLatest()]);

    const latestByDevice = latestResult?.values.reduce<{
      [id: string]: LatestReadingResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    setLatestData(latestByDevice || {});
    saveDevicesToLocalStorage(latestResult?.values || []);
    setLoadingMainContent(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchReadings();
  }, [options]);

  return (
    <>
      <TimeFrameSelector
        options={options}
        onChange={newOptions => {
          setLoadingReadings(true);
          setOptions(newOptions);
        }}
      />
      {devices.length === 0 && isLoadingMainContent ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          style={{ height: '600px', maxHeight: 'calc(100vh - 200px)' }}
        >
          <GraphLoading />
        </Flex>
      ) : (
        <CardGrid>
          {devices.map(device => (
            <DeviceCard
              id={device.id}
              name={device.name}
              key={device.id}
              options={options}
              latestData={latestData[device.id]}
              statisticsData={statisticsData[device.id]}
              readingsData={readingsData[device.id]?.values}
              isLoadingMainContent={
                isLoadingMainContent || isLoadingMainContent === undefined
              }
              isLoadingReadings={
                isLoadingReadings || isLoadingReadings === undefined
              }
            />
          ))}
        </CardGrid>
      )}
    </>
  );
};
