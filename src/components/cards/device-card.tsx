import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
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

const StyledDeviceCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
`;
const TopCard = styled(Link)`
  display: block;
  padding-top: ${({ theme }) => theme.spacings.s12};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const ReadingGrid = styled.div`
  flex-grow: 1;
  justify-content: center;

  display: grid;
  gap: 0 ${({ theme }) => theme.spacings.s12};
  grid-template-rows: repeat(2, fit-content(100%));
  grid-template-columns: fit-content(100%) fit-content(100%) fit-content(100%);
`;

const TimePeriodReadings = styled.div`
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
        <Flex alignItems="center" px="s16" gap="s8">
          {deviceSensors.includes('airQuality') && (
            <ReadingContainer style={{ flexBasis: '15%' }}>
              <Reading
                value={latestData?.reading?.airQuality}
                unit="airQuality"
                isLoading={isLoadingMainContent}
                showTitle={true}
              />
            </ReadingContainer>
          )}
          <ReadingGrid>
            {deviceSensors.includes('humidity') && (
              <ReadingContainer style={{ flexBasis: '15%' }}>
                <Reading
                  value={latestData?.reading?.humidity}
                  unit="humidity"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('pressure') && (
              <ReadingContainer style={{ flexBasis: '20%' }}>
                <Reading
                  value={latestData?.reading?.pressure}
                  unit="pressure"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('co2') && (
              <ReadingContainer style={{ flexBasis: '15%' }}>
                <Reading
                  value={latestData?.reading?.co2}
                  unit="co2"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('nox') && (
              <ReadingContainer style={{ flexBasis: '15%' }}>
                <Reading
                  value={latestData?.reading?.nox}
                  unit="nox"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('voc') && (
              <ReadingContainer style={{ flexBasis: '15%' }}>
                <Reading
                  value={latestData?.reading?.voc}
                  unit="voc"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
            {deviceSensors.includes('pm25') && (
              <ReadingContainer style={{ flexBasis: '15%' }}>
                <Reading
                  value={latestData?.reading?.pm25}
                  unit="pm25"
                  isLoading={isLoadingMainContent}
                  showTitle={true}
                />
              </ReadingContainer>
            )}
          </ReadingGrid>
          {deviceSensors.includes('temperature') && (
            <ReadingContainer pr="s16" style={{ flexBasis: '15%' }}>
              <Reading
                value={latestData?.reading?.temperature}
                unit="temperature"
                isLoading={isLoadingMainContent}
                showTitle={true}
              />
            </ReadingContainer>
          )}
        </Flex>
      </TopCard>
      <TimePeriodReadings>
        <Flex pt="s16" pl="s16" style={{ flexGrow: 1 }}>
          <Caption2Light style={{ textTransform: 'capitalize' }}>
            {options.timePeriod}
          </Caption2Light>
        </Flex>
        {deviceSensors.includes('humidity') && (
          <ReadingContainer
            flexDirection="column"
            pt="s16"
            style={{ flexBasis: '15%' }}
          >
            <Reading
              value={statisticsData?.statistics.humidity.max}
              unit="humidity"
              variant="max"
              sizeVariant="small"
              isLoading={isLoadingReadings}
            />
            <Reading
              value={statisticsData?.statistics.humidity.min}
              unit="humidity"
              variant="min"
              sizeVariant="small"
              isLoading={isLoadingReadings}
            />
          </ReadingContainer>
        )}
        {deviceSensors.includes('pressure') && (
          <ReadingContainer
            flexDirection="column"
            pt="s16"
            style={{ flexBasis: '20%' }}
          >
            <Flex flexDirection="column">
              <Reading
                value={statisticsData?.statistics.pressure.max}
                unit="pressure"
                variant="max"
                sizeVariant="small"
                isLoading={isLoadingReadings}
              />
              <Reading
                value={statisticsData?.statistics.pressure.min}
                unit="pressure"
                variant="min"
                sizeVariant="small"
                isLoading={isLoadingReadings}
              />
            </Flex>
          </ReadingContainer>
        )}
        {deviceSensors.includes('temperature') && (
          <ReadingContainer
            flexDirection="column"
            pt="s16"
            pr="s16"
            style={{ flexBasis: '15%' }}
          >
            <Reading
              value={statisticsData?.statistics.temperature.max}
              unit="temperature"
              variant="max"
              sizeVariant="small"
              isLoading={isLoadingReadings}
            />
            <Reading
              value={statisticsData?.statistics.temperature.min}
              unit="temperature"
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
