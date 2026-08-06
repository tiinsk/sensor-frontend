import React, { useState } from 'react';
import { useParams } from 'react-router';
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
import { TimeAgoTag } from '../components/tags/time-ago-tag';
import { getDeviceSensors } from '../utils/device';
import { getDefaultTimeFrameOptions } from '../storage/time-frame';
import { Skeleton } from '../assets/loading/skeleton';
import { ScoreReading } from '../components/styled/readings/score-reading';
import { useDevice } from '../hooks/use-devices';
import { useDeviceLatestReading } from '../hooks/use-latest-readings';
import { useDeviceAverageStatistics } from '../hooks/use-statistics';
import { useDeviceTimeFrameReadings } from '../hooks/use-time-frame-data';
import { useDeviceLiveReadingsSync } from '../hooks/use-catch-up-readings';

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
  height: 230px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;

export const Device = () => {
  const { id } = useParams();
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<TimeFrameOptions>(() => ({
    ...getDefaultTimeFrameOptions(),
    showMinAndMax: true,
  }));

  const { data: device, isPending: isPendingDevice } = useDevice(id);
  const { data: latestData, isPending: isPendingLatest } =
    useDeviceLatestReading(id);
  const {
    day: statisticsDay,
    week: statisticsWeek,
    month: statisticsMonth,
    isPending: isPendingStatistics,
  } = useDeviceAverageStatistics(id);
  const { data: readingData, isPending: isPendingReadings } =
    useDeviceTimeFrameReadings(id, options);

  useDeviceLiveReadingsSync({
    options,
    deviceId: id,
    readingsReady: !isPendingReadings,
  });

  const isLoadingLatest = isPendingDevice || isPendingLatest;

  const deviceSensors = device?.type ? getDeviceSensors(device.type) : [];

  return (
    <div>
      <TitleWrapper>
        <H2 mb="s4" isLoading={isPendingDevice} loadingWidth="s192">
          {device?.name}
        </H2>
      </TitleWrapper>
      <LatestReadings>
        <Flex justifyContent="flex-end">
          <TimeAgoTag
            date={latestData?.reading?.timestamp}
            isLoading={isLoadingLatest}
          />
        </Flex>
        <LatestReadingsWrapper $sensorCount={deviceSensors.length}>
          {isLoadingLatest ? (
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
        {isPendingDevice && isPendingStatistics && (
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
            day={statisticsDay?.airQuality || {}}
            week={statisticsWeek?.airQuality || {}}
            month={statisticsMonth?.airQuality || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('humidity') && (
          <AverageCard
            unit="humidity"
            day={statisticsDay?.humidity || {}}
            week={statisticsWeek?.humidity || {}}
            month={statisticsMonth?.humidity || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('pressure') && (
          <AverageCard
            unit="pressure"
            day={statisticsDay?.pressure || {}}
            week={statisticsWeek?.pressure || {}}
            month={statisticsMonth?.pressure || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('co2') && (
          <AverageCard
            unit="co2"
            day={statisticsDay?.co2 || {}}
            week={statisticsWeek?.co2 || {}}
            month={statisticsMonth?.co2 || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('temperature') && (
          <AverageCard
            unit="temperature"
            day={statisticsDay?.temperature || {}}
            week={statisticsWeek?.temperature || {}}
            month={statisticsMonth?.temperature || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('nox') && (
          <AverageCard
            unit="nox"
            day={statisticsDay?.nox || {}}
            week={statisticsWeek?.nox || {}}
            month={statisticsMonth?.nox || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('voc') && (
          <AverageCard
            unit="voc"
            day={statisticsDay?.voc || {}}
            week={statisticsWeek?.voc || {}}
            month={statisticsMonth?.voc || {}}
            isLoading={isPendingStatistics}
          />
        )}
        {deviceSensors.includes('pm25') && (
          <AverageCard
            unit="pm25"
            day={statisticsDay?.pm25 || {}}
            week={statisticsWeek?.pm25 || {}}
            month={statisticsMonth?.pm25 || {}}
            isLoading={isPendingStatistics}
          />
        )}
      </AverageWrapper>
      <Box mt="s16">
        <TimeFrameSelector
          options={options}
          selectors={['timePeriod']}
          onChange={setOptions}
        />
      </Box>
      <StyledGraphCard>
        {isPendingReadings || readingData === undefined || !device ? (
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
                      timezone={device.timezone}
                      showAxis={deviceSensors.length === 1}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
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
                      timezone={device.timezone}
                      showAxis={!deviceSensors.includes('pressure')}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
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
                      timezone={device.timezone}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('airQuality') && (
              <StyledGraphContainer>
                {id && readingData?.airQuality && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.airQuality}
                      options={options}
                      valueType="airQuality"
                      timezone={device.timezone}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('co2') && (
              <StyledGraphContainer>
                {id && readingData?.co2 && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.co2}
                      options={options}
                      valueType="co2"
                      timezone={device.timezone}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('pm25') && (
              <StyledGraphContainer>
                {id && readingData?.pm25 && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.pm25}
                      options={options}
                      valueType="pm25"
                      timezone={device.timezone}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('voc') && (
              <StyledGraphContainer>
                {id && readingData?.voc && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.voc}
                      options={options}
                      valueType="voc"
                      timezone={device.timezone}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
                    />
                  </GraphSizeWrapper>
                )}
              </StyledGraphContainer>
            )}
            {deviceSensors.includes('nox') && (
              <StyledGraphContainer>
                {id && readingData?.nox && (
                  <GraphSizeWrapper>
                    <Graph
                      deviceId={id}
                      data={readingData.nox}
                      options={options}
                      valueType="nox"
                      timezone={device.timezone}
                      hoveredDate={hoveredDate}
                      onHover={date => setHoveredDate(date)}
                      showTitle={true}
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
