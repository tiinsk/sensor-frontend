import React, { useState } from 'react';
import styled from 'styled-components';
import {
  LatestReadingResponse,
  Reading as ReadingType,
  StatisticsResponse,
} from '../../api/types';
import { Body, Caption2Light } from '../styled/typography';
import { Tag } from '../styled/tag';
import { getTimeAgoString } from '../../utils/datetime';
import { DateTime } from 'luxon';
import { Reading } from '../styled/readings';
import { Flex } from '../styled/flex';
import { Link } from 'react-router-dom';
import { TimeFrameOptions } from '../selectors/time-frame-selector';
import { Graph } from '../graphs/graph';
import { GraphSizeWrapper } from '../graphs/graph-size-wrapper';

const StyledDeviceCard = styled(Link)`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borders.secondaryHover};
    box-shadow: ${({ theme }) => theme.colors.shadows.boxShadowHover};
  }
`;
const TopCard = styled.div`
  display: block;
  padding-top: ${({ theme }) => theme.spacings.s16};
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
`;

const BorderedFlex = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  align-items: center;
`;

const BottomCard = styled.div`
  height: 200px;
`;

export const DeviceCard = ({
  latestData,
  statisticsData,
  readingsData,
  options,
}: {
  latestData: LatestReadingResponse;
  statisticsData?: StatisticsResponse;
  readingsData?: ReadingType[];
  options: TimeFrameOptions;
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);

  const timeDiff = Math.abs(
    DateTime.fromISO(latestData.reading.created_at).diffNow('minutes').minutes
  );
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <StyledDeviceCard to={`/devices/${latestData.id}`}>
      <TopCard>
        <Flex justifyContent="flex-end" px="s8" mb="s8">
          <Tag
            variant={tagVariant}
            text={getTimeAgoString(latestData.reading.created_at)}
          />
        </Flex>
        <TopGrid>
          <BorderedFlex pl="s16">
            <Body>{latestData.name}</Body>
          </BorderedFlex>
          <BorderedFlex pl="s16" justifyContent="flex-start">
            <Reading value={latestData.reading.humidity} unit="humidity" />
          </BorderedFlex>
          <BorderedFlex justifyContent="center">
            <Reading value={latestData.reading.pressure} unit="pressure" />
          </BorderedFlex>
          <BorderedFlex pr="s16" justifyContent="flex-end">
            <Reading
              value={latestData.reading.temperature}
              unit="temperature"
            />
          </BorderedFlex>
          <Flex pt="s16" pl="s16">
            <Caption2Light style={{ textTransform: 'capitalize' }}>
              {options.timePeriod}
            </Caption2Light>
          </Flex>
          <Flex
            flexDirection="column"
            pt="s16"
            pl="s16"
            alignItems="flex-start"
          >
            <Reading
              value={statisticsData?.statistics.humidity.max}
              unit="humidity"
              variant="max"
              sizeVariant="small"
            />
            <Reading
              value={statisticsData?.statistics.humidity.min}
              unit="humidity"
              variant="min"
              sizeVariant="small"
            />
          </Flex>
          <Flex flexDirection="column" pt="s16" alignItems="center">
            <Reading
              value={statisticsData?.statistics.pressure.max}
              unit="pressure"
              variant="max"
              sizeVariant="small"
            />
            <Reading
              value={statisticsData?.statistics.pressure.min}
              unit="pressure"
              variant="min"
              sizeVariant="small"
            />
          </Flex>
          <Flex flexDirection="column" pt="s16" pr="s16" alignItems="flex-end">
            <Reading
              value={statisticsData?.statistics.temperature.max}
              unit="temperature"
              variant="max"
              sizeVariant="small"
            />
            <Reading
              value={statisticsData?.statistics.temperature.min}
              unit="temperature"
              variant="min"
              sizeVariant="small"
            />
          </Flex>
        </TopGrid>
      </TopCard>
      <BottomCard>
        <GraphSizeWrapper>
          {readingsData && (
            <Graph
              deviceId={latestData.id}
              options={options}
              data={readingsData}
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
