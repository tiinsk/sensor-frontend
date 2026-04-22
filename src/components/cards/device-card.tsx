import React, { useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import {
  DeviceType,
  LatestReadingResponse,
  Reading as ReadingType,
  StatisticsResponse,
} from '../../api/types';
import { Caption2Light, H4 } from '../styled/typography';
import { Reading } from '../styled/readings';
import { Flex } from '../styled/flex';
import { Link } from 'react-router-dom';
import { TimeFrameOptions } from '../selectors/time-frame-selector';
import { Graph } from '../graphs/graph';
import { GraphSizeWrapper } from '../graphs/graph-size-wrapper';
import { GraphLoading } from '../../assets/loading/graph-loading';
import { TimeAgoTag } from '../tags/time-ago-tag';
import { getDeviceSensors } from '../../utils/device';
import { MinMax } from '../../utils/readings';
import { ScoreReading } from '../styled/readings/score-reading';

const StyledDeviceCard = styled.div`
  display: flex;
  flex-direction: column;

  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
`;
const TopCard = styled(Link)`
  display: flex;
  padding-top: ${({ theme }) => theme.spacings.s12};
  min-height: ${({ theme }) => theme.spacings.s128};
  flex-direction: column;
  justify-content: space-around;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const SimpleSensorStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacings.s16};
`;

const MultiSensorStyle = css`
  display: grid;
  justify-content: space-between;
  gap: 0 ${({ theme }) => theme.spacings.s12};
  grid-template-columns: repeat(5, fit-content(100%));

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(3, fit-content(100%));
  }
`;

const ReadingGrid = styled.div<{ $sensorCount: number }>`
  flex-grow: 1;
  ${({ $sensorCount }) =>
    $sensorCount > 4 ? MultiSensorStyle : SimpleSensorStyle};
  );
`;

const TimePeriodReadings = styled.div`
  flex-grow: 1;

  display: flex;
  border-top: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  gap: ${({ theme }) => theme.spacings.s8};
`;

const ReadingContainer = styled(Flex)`
  align-items: flex-start;
`;

const BottomCard = styled.div`
  height: 175px;
`;

export const DeviceCard = ({
  id,
  name,
  type,
  latestData,
  statisticsData,
  readingsData,
  options,
  isLoadingMainContent,
  isLoadingReadings,
  minMax,
}: {
  id: string;
  name: string;
  type: DeviceType;
  latestData?: LatestReadingResponse;
  statisticsData?: StatisticsResponse;
  readingsData?: ReadingType[];
  options: TimeFrameOptions;
  isLoadingMainContent?: boolean;
  isLoadingReadings?: boolean;
  minMax?: MinMax;
}) => {
  const { colors } = useTheme();
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);

  const deviceSensors = getDeviceSensors(type);

  return (
    <StyledDeviceCard>
      <TopCard to={`/devices/${id}`}>
        <Flex justifyContent="space-between" px="s16" mb="s8" gap="s16">
          <H4>{name}</H4>
          <TimeAgoTag
            date={latestData?.reading?.timestamp}
            isLoading={isLoadingMainContent}
          />
        </Flex>
        <Flex px="s16" gap="s24" justifyContent="end">
          <ReadingGrid $sensorCount={deviceSensors.length}>
            {deviceSensors.includes('airQuality') && (
              <ReadingContainer style={{ gridRowStart: 'span 2' }}>
                <ScoreReading
                  value={latestData?.reading?.airQuality}
                  unit="airQuality"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('humidity') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.humidity}
                  unit="humidity"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('pressure') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.pressure}
                  unit="pressure"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('co2') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.co2}
                  unit="co2"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('temperature') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.temperature}
                  unit="temperature"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('nox') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.nox}
                  unit="nox"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('voc') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.voc}
                  unit="voc"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('pm25') && (
              <ReadingContainer>
                <Reading
                  value={latestData?.reading?.pm25}
                  unit="pm25"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
          </ReadingGrid>
        </Flex>
      </TopCard>
      <TimePeriodReadings>
        <Flex pt="s16" pl="s16" style={{ flexGrow: 1 }}>
          <Caption2Light style={{ textTransform: 'capitalize' }}>
            {options.timePeriod}
          </Caption2Light>
        </Flex>
        {options.valueType && deviceSensors.includes(options.valueType) && (
          <ReadingContainer flexDirection="column" pt="s16" pr="s16">
            <Reading
              value={statisticsData?.statistics[options.valueType].max}
              unit={options.valueType}
              variant="max"
              sizeVariant="small"
              isLoading={isLoadingReadings}
            />
            <Reading
              value={statisticsData?.statistics[options.valueType].min}
              unit={options.valueType}
              variant="min"
              sizeVariant="small"
              isLoading={isLoadingReadings}
            />
          </ReadingContainer>
        )}
      </TimePeriodReadings>
      <BottomCard>
        {options.valueType && deviceSensors.includes(options.valueType) ? (
          <GraphSizeWrapper>
            {isLoadingReadings ? (
              <Flex
                style={{ height: '100%' }}
                justifyContent="center"
                alignItems="center"
              >
                <GraphLoading />
              </Flex>
            ) : (
              <Graph
                deviceId={id}
                options={options}
                data={readingsData || []}
                minMax={minMax}
                valueType={options.valueType || 'temperature'}
                hoveredDate={hoveredDate}
                onHover={date => setHoveredDate(date)}
              />
            )}
          </GraphSizeWrapper>
        ) : (
          <Flex
            style={{ height: '100%' }}
            justifyContent="center"
            alignItems="center"
          >
            <Caption2Light
              style={{ color: colors.typography.secondary }}
              mb="s24"
            >
              No Sensor
            </Caption2Light>
          </Flex>
        )}
      </BottomCard>
    </StyledDeviceCard>
  );
};
