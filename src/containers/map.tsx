import { useEffect, useState } from 'react';
import api from '../api/routes';
import {
  DeviceResponse,
  LatestReadingResponse,
  StatisticsResponse,
} from '../api/types';
import {
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import {
  getDefaultTimeLevel,
  getTimeFrame,
} from '../components/selectors/time-frames';
import { getLocalstorageDevices, setLocalstorageDevices } from './home';
import { MapSvg } from '../assets/map';
import styled from 'styled-components';
import { H3 } from '../components/styled/typography';
import { Flex } from '../components/styled/flex';
import { MapReading } from '../components/map/map-reading';
import { GraphLoading } from '../assets/loading/graph-loading';

const MapCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  padding: ${({ theme }) => theme.spacings.s24};
  padding-bottom: ${({ theme }) => theme.spacings.s48};

  background-image: repeating-linear-gradient(
      ${({ theme }) => theme.colors.background.secondary} 0 1px,
      transparent 1px 100%
    ),
    repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.background.secondary} 0 1px,
      transparent 1px 100%
    );
  background-size: 10px 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: fit-content;
  }
`;

const CardWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    overflow-x: auto;
    margin-left: -${({ theme }) => theme.spacings.s48};
    margin-right: -${({ theme }) => theme.spacings.s48};

    padding-left: ${({ theme }) => theme.spacings.s48};
    padding-right: ${({ theme }) => theme.spacings.s48};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -${({ theme }) => theme.spacings.s16};
    margin-right: -${({ theme }) => theme.spacings.s16};

    padding-left: ${({ theme }) => theme.spacings.s16};
    padding-right: ${({ theme }) => theme.spacings.s16};
  }
`;

const MapWrapper = styled.div`
  position: relative;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const Map = () => {
  const [options, setOptions] = useState<TimeFrameOptions>(() => ({
    offsetFromNow: 0,
    timePeriod: 'day',
    valueType: 'temperature',
    level: getDefaultTimeLevel(),
    showMinAndMax: true,
  }));

  const [devices, setDevices] = useState<DeviceResponse[]>(
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

  const saveDevicesToLocalStorage = (devicesData: DeviceResponse[]) => {
    setLocalstorageDevices(devicesData);
    setDevices(devicesData);
  };

  const fetchReadings = async () => {
    const { graphStartTime, graphEndTime } = getTimeFrame(options);
    setLoadingReadings(true);
    const [statisticsResult] = await Promise.all([
      api.getAllStatistics({
        startTime: graphStartTime,
        endTime: graphEndTime,
      }),
    ]);

    const statisticsByDevice = statisticsResult?.values.reduce<{
      [id: string]: StatisticsResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    setStatisticsData(statisticsByDevice || {});
    setLoadingReadings(false);
  };

  const fetchMainContent = async () => {
    setLoadingMainContent(true);
    const [devicesResult, latestResult] = await Promise.all([
      api.getAllDevices(),
      api.getAllLatest(),
    ]);

    const latestByDevice = latestResult?.values.reduce<{
      [id: string]: LatestReadingResponse | undefined;
    }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    setLatestData(latestByDevice || {});
    saveDevicesToLocalStorage(devicesResult?.values || []);
    setLoadingMainContent(false);
  };

  useEffect(() => {
    fetchMainContent();
  }, []);

  useEffect(() => {
    fetchReadings();
    if (options.offsetFromNow === 0) {
      fetchMainContent();
    }
  }, [options]);

  return (
    <div>
      <TimeFrameSelector
        options={options}
        onChange={newOptions => {
          setLoadingReadings(true);
          setOptions(newOptions);
        }}
        selectors={['valueType']}
      />
      <CardWrapper>
        <MapCard>
          <H3>Map</H3>
          <Flex mt="s40" justifyContent="center" alignItems="center">
            <MapWrapper>
              <MapSvg
                style={{
                  opacity:
                    isLoadingMainContent && devices.length === 0 ? 0.25 : 1,
                }}
              />
              {isLoadingMainContent && devices.length === 0 ? (
                <LoadingWrapper>
                  <GraphLoading />
                </LoadingWrapper>
              ) : (
                devices.map(device => {
                  const reading =
                    options.offsetFromNow === 0
                      ? {
                          avg: latestData[device.id]?.reading[
                            options.valueType || 'temperature'
                          ],
                          min: statisticsData[device.id]?.statistics[
                            options.valueType || 'temperature'
                          ].min,
                          max: statisticsData[device.id]?.statistics[
                            options.valueType || 'temperature'
                          ].max,
                          created_at: latestData[device.id]?.reading.created_at,
                        }
                      : {
                          avg: statisticsData[device.id]?.statistics[
                            options.valueType || 'temperature'
                          ].avg,
                          min: statisticsData[device.id]?.statistics[
                            options.valueType || 'temperature'
                          ].min,
                          max: statisticsData[device.id]?.statistics[
                            options.valueType || 'temperature'
                          ].max,
                          created_at: undefined,
                        };
                  return (
                    <div
                      key={device.id}
                      style={{
                        position: 'absolute',
                        left: `${device.location.x}%`,
                        top: `${device.location.y}%`,
                        transform: 'translate(-50%, 0)',
                      }}
                    >
                      <MapReading
                        variant={options.offsetFromNow === 0 ? 'latest' : 'avg'}
                        reading={reading}
                        unit={options.valueType || 'temperature'}
                        title={device.name}
                        isLoading={isLoadingReadings}
                      />
                    </div>
                  );
                })
              )}
            </MapWrapper>
          </Flex>
        </MapCard>
      </CardWrapper>
    </div>
  );
};
