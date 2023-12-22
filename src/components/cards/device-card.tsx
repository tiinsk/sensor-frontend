import React, { useState } from 'react';
import styled from 'styled-components';
import {
  LatestReadingResponse,
  Reading as ReadingType,
  StatisticsResponse,
} from '../../api/types';
import { Caption2Light, H4 } from '../styled/typography';
import { Tag } from '../styled/tag';
import { getTimeAgoString } from '../../utils/datetime';
import { DateTime } from 'luxon';
import { Reading } from '../styled/readings';
import { Flex } from '../styled/flex';
import { Link } from 'react-router-dom';
import { TimeFrameOptions } from '../selectors/time-frame-selector';
import { Graph } from '../graphs/graph';
import { GraphSizeWrapper } from '../graphs/graph-size-wrapper';
import { GraphLoading } from '../../assets/loading/graph-loading';

const StyledDeviceCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
`;
const TopCard = styled(Link)`
  display: block;
  padding-top: ${({ theme }) => theme.spacings.s24};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
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
  height: 200px;
`;

export const DeviceCard = ({
  id,
  name,
  latestData,
  statisticsData,
  readingsData,
  options,
  isLoadingMainContent,
  isLoadingReadings,
}: {
  id: string;
  name: string;
  latestData?: LatestReadingResponse;
  statisticsData?: StatisticsResponse;
  readingsData?: ReadingType[];
  options: TimeFrameOptions;
  isLoadingMainContent?: boolean;
  isLoadingReadings?: boolean;
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);

  const timeDiff = latestData?.reading.created_at
    ? Math.abs(
        DateTime.fromISO(latestData.reading.created_at).diffNow('minutes')
          .minutes
      )
    : 0;
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <StyledDeviceCard>
      <TopCard to={`/devices/${id}`}>
        <Flex justifyContent="flex-end" px="s16" mb="s8">
          <H4 style={{ flexGrow: 1 }}>{name}</H4>
        </Flex>
        <Flex alignItems="center" gap="s8">
          <Flex pl="s16" style={{ flexGrow: 1 }}>
            <Tag
              variant={tagVariant}
              text={getTimeAgoString(latestData?.reading.created_at)}
              isLoading={isLoadingMainContent}
            />
          </Flex>
          <ReadingContainer style={{ flexBasis: '15%' }}>
            <Reading
              value={latestData?.reading.humidity}
              unit="humidity"
              isLoading={isLoadingMainContent}
            />
          </ReadingContainer>
          <ReadingContainer style={{ flexBasis: '20%' }}>
            <Reading
              value={latestData?.reading.pressure}
              unit="pressure"
              isLoading={isLoadingMainContent}
            />
          </ReadingContainer>
          <ReadingContainer pr="s16" style={{ flexBasis: '15%' }}>
            <Reading
              value={latestData?.reading.temperature}
              unit="temperature"
              isLoading={isLoadingMainContent}
            />
          </ReadingContainer>
        </Flex>
      </TopCard>
      <TimePeriodReadings>
        <Flex pt="s16" pl="s16" style={{ flexGrow: 1 }}>
          <Caption2Light style={{ textTransform: 'capitalize' }}>
            {options.timePeriod}
          </Caption2Light>
        </Flex>
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
      </TimePeriodReadings>
      <BottomCard>
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
              valueType={options.valueType || 'temperature'}
              hoveredDate={hoveredDate}
              onHover={date => setHoveredDate(date)}
            />
          )}
        </GraphSizeWrapper>
      </BottomCard>
    </StyledDeviceCard>
  );
};
