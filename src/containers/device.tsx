import React, { useEffect, useState } from 'react';
import api from '../api/routes';
import { DeviceResponse, Reading as ReadingType } from '../api/types';
import { useParams } from 'react-router-dom';
import { LatestReadingResponse, Statistics } from '../api/types';
import { Flex } from '../components/styled/flex';
import { H2 } from '../components/styled/typography';
import { Reading } from '../components/styled/readings';
import {
  AverageCard,
  StyledDeviceCard,
} from '../components/cards/average-card';
import {
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { Box } from '../components/styled/box';
import styled from 'styled-components';
import { Graph } from '../components/graphs/graph';
import { GraphSizeWrapper } from '../components/graphs/graph-size-wrapper';
import { GraphLoading } from '../assets/loading/graph-loading';
import {
  getEndTime,
  getStartTime,
  getTimeFrame,
} from '../components/selectors/time-frames';
import { TimeAgoTag } from '../components/tags/time-ago-tag';
import { getDeviceSensors } from '../utils/device';
import { getDefaultTimeFrameOptions } from '../storage/time-frame';
import { Skeleton } from '../assets/loading/skeleton';
import { ScoreReading } from '../components/styled/readings/score-reading';

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacings.s16};

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacings.s16};
  }
`;

const AverageWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacings.s16};
  grid-template-columns: repeat(3, 1fr);

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const LatestReadings = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: ${({ theme }) => theme.spacings.s16};
  padding: ${({ theme }) => theme.spacings.s16}
    ${({ theme }) => theme.spacings.s32};

  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: ${({ theme }) => theme.spacings.s16}
      ${({ theme }) => theme.spacings.s16};
  }
`;

const LatestReadingsWrapper = styled.div<{ $sensorCount: number }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacings.s64};
  justify-content: ${({ $sensorCount }) =>
    $sensorCount > 3 ? 'space-between' : 'flex-start'};

  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 ${({ theme }) => theme.spacings.s16};
  }
`;

const StyledGraphCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  border-bottom: none;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  margin-bottom: ${({ theme }) => theme.spacings.s16};
`;

const StyledGraphContainer = styled.div`
  height: 200px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;

export const Device = () => {
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<TimeFrameOptions>(() => ({
    ...getDefaultTimeFrameOptions(),
    showMinAndMax: true,
  }));
  const [device, setDevice] = useState<DeviceResponse | undefined>(undefined);
  const [latestData, setLatestData] = useState<
    LatestReadingResponse | undefined
  >(undefined);

  const [statisticsData, setStatisticsData] = useState<{
    day: Statistics | undefined;
    week: Statistics | undefined;
    month: Statistics | undefined;
  }>({ day: undefined, week: undefined, month: undefined });

  const [isLoadingReadings, setLoadingReadings] = useState<boolean>(false);
  const [isLoadingMainContent, setLoadingMainContent] =
    useState<boolean>(false);
  const [readingData, setReadingData] = useState<
    { [type: string]: ReadingType[] | undefined } | undefined
  >(undefined);

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      setLoadingMainContent(true);
      const [
        deviceData,
        latest,
        statisticsDay,
        statisticsWeek,
        statisticsMonth,
      ] = await Promise.all([
        api.getDevice(id),
        api.getDeviceLatestReadings(id),
        api.getAllDeviceStatistics({
          startTime: getStartTime(0, 'day')!,
          endTime: getEndTime(0, 'day')!,
          deviceId: id,
        }),
        api.getAllDeviceStatistics({
          startTime: getStartTime(0, 'week')!,
          endTime: getEndTime(0, 'week')!,
          deviceId: id,
        }),
        api.getAllDeviceStatistics({
          startTime: getStartTime(0, 'month')!,
          endTime: getEndTime(0, 'month')!,
          deviceId: id,
        }),
      ]);

      if (latest) {
        setLatestData(latest);
      }

      if (deviceData) {
        setDevice(deviceData);
      }

      setStatisticsData({
        day: statisticsDay?.statistics,
        week: statisticsWeek?.statistics,
        month: statisticsMonth?.statistics,
      });
      setLoadingMainContent(false);
    }
  };

  const fetchReadings = async () => {
    if (id) {
      const { graphStartTime, graphEndTime } = getTimeFrame(options);

      const readings = await api.getDeviceReadings({
        deviceId: id,
        startTime: graphStartTime,
        endTime: graphEndTime,
        types: ['temperature', 'humidity', 'pressure'],
        level: options.level,
      });

      const readingsByType = readings?.values.reduce<{
        [type: string]: ReadingType[] | undefined;
      }>((acc, cur) => {
        acc[cur.type] = cur.values;
        return acc;
      }, {});
      setReadingData(readingsByType);
      setLoadingReadings(false);
    }
  };

  useEffect(() => {
    setReadingData(undefined);
    fetchData();
    fetchReadings();
  }, [id, options]);

  const deviceSensors = device?.type ? getDeviceSensors(device?.type) : [];

  return (
    <div>
      <TitleWrapper>
        <H2 mb="s4" isLoading={!latestData?.name} loadingWidth="s192">
          {latestData?.name}
        </H2>
      </TitleWrapper>
      <LatestReadings>
        <Flex justifyContent="flex-end">
          <TimeAgoTag
            date={latestData?.reading?.timestamp}
            isLoading={isLoadingMainContent}
          />
        </Flex>
        <LatestReadingsWrapper $sensorCount={deviceSensors.length}>
          {isLoadingMainContent ? (
            <Flex
              py="s8"
              gap="s32"
              style={{ flexGrow: 1, gridColumnStart: 'span 2' }}
            >
              <Skeleton variant="custom" customHeight="s96" />
              <Skeleton variant="custom" customHeight="s96" />
              <Skeleton variant="custom" customHeight="s96" />
            </Flex>
          ) : (
            <>
              {deviceSensors.includes('airQuality') && (
                <ScoreReading
                  value={latestData?.reading?.airQuality}
                  unit="airQuality"
                  showTitle={true}
                />
              )}
              {deviceSensors.includes('humidity') && (
                <Reading
                  value={latestData?.reading?.humidity}
                  unit="humidity"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
              {deviceSensors.includes('pressure') && (
                <Reading
                  value={latestData?.reading?.pressure}
                  unit="pressure"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
              {deviceSensors.includes('co2') && (
                <Reading
                  value={latestData?.reading?.co2}
                  unit="co2"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
              {deviceSensors.includes('temperature') && (
                <Reading
                  value={latestData?.reading?.temperature}
                  unit="temperature"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
              {deviceSensors.includes('nox') && (
                <Reading
                  value={latestData?.reading?.nox}
                  unit="nox"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
              {deviceSensors.includes('voc') && (
                <Reading
                  value={latestData?.reading?.voc}
                  unit="voc"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
              {deviceSensors.includes('pm25') && (
                <Reading
                  value={latestData?.reading?.pm25}
                  unit="pm25"
                  showTitle={true}
                  sizeVariant="large"
                />
              )}
            </>
          )}
        </LatestReadingsWrapper>
      </LatestReadings>
      <AverageWrapper>
        {isLoadingMainContent && (
          <>
            <StyledDeviceCard>
              <Skeleton variant="Body" width="s96" />
              <Skeleton variant="custom" customHeight="s96" />
            </StyledDeviceCard>
            <StyledDeviceCard>
              <Skeleton variant="Body" width="s96" />
              <Skeleton variant="custom" customHeight="s96" />
            </StyledDeviceCard>
            <StyledDeviceCard>
              <Skeleton variant="Body" width="s96" />
              <Skeleton variant="custom" customHeight="s96" />
            </StyledDeviceCard>
          </>
        )}
        {deviceSensors.includes('airQuality') && (
          <AverageCard
            unit="airQuality"
            day={statisticsData.day?.airQuality || {}}
            week={statisticsData.week?.airQuality || {}}
            month={statisticsData.month?.airQuality || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('humidity') && (
          <AverageCard
            unit="humidity"
            day={statisticsData.day?.humidity || {}}
            week={statisticsData.week?.humidity || {}}
            month={statisticsData.month?.humidity || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('pressure') && (
          <AverageCard
            unit="pressure"
            day={statisticsData.day?.pressure || {}}
            week={statisticsData.week?.pressure || {}}
            month={statisticsData.month?.pressure || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('co2') && (
          <AverageCard
            unit="co2"
            day={statisticsData.day?.co2 || {}}
            week={statisticsData.week?.co2 || {}}
            month={statisticsData.month?.co2 || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('temperature') && (
          <AverageCard
            unit="temperature"
            day={statisticsData.day?.temperature || {}}
            week={statisticsData.week?.temperature || {}}
            month={statisticsData.month?.temperature || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('nox') && (
          <AverageCard
            unit="nox"
            day={statisticsData.day?.nox || {}}
            week={statisticsData.week?.nox || {}}
            month={statisticsData.month?.nox || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('voc') && (
          <AverageCard
            unit="voc"
            day={statisticsData.day?.voc || {}}
            week={statisticsData.week?.voc || {}}
            month={statisticsData.month?.voc || {}}
            isLoading={isLoadingMainContent}
          />
        )}
        {deviceSensors.includes('pm25') && (
          <AverageCard
            unit="pm25"
            day={statisticsData.day?.pm25 || {}}
            week={statisticsData.week?.pm25 || {}}
            month={statisticsData.month?.pm25 || {}}
            isLoading={isLoadingMainContent}
          />
        )}
      </AverageWrapper>
      <Box mt="s16">
        <TimeFrameSelector
          options={options}
          selectors={['timePeriod']}
          onChange={newOptions => {
            setOptions(newOptions);
            setReadingData(undefined);
          }}
        />
      </Box>
      <StyledGraphCard>
        {isLoadingReadings || readingData === undefined ? (
          <Flex
            style={{ height: '600px' }}
            justifyContent="center"
            alignItems="center"
          >
            <GraphLoading />
          </Flex>
        ) : (
          <>
            {deviceSensors.includes('temperature') && (
              <StyledGraphContainer>
                {id && readingData?.temperature && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.temperature}
                      options={options}
                      valueType="temperature"
                      showAxis={deviceSensors.length === 1}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('humidity') && (
              <StyledGraphContainer>
                {id && readingData?.humidity && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.humidity}
                      options={options}
                      valueType="humidity"
                      showAxis={!deviceSensors.includes('pressure')}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('pressure') && (
              <StyledGraphContainer>
                {id && readingData?.pressure && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.pressure}
                      options={options}
                      valueType="pressure"
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
          </>
        )}
      </StyledGraphCard>
    </div>
  );
};
