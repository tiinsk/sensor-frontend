import React from 'react';
import styled from 'styled-components';
import { LatestReadingResponse } from '../../api/types';
import { Body, Caption2Light } from '../styled/typography';
import { Tag } from '../styled/tag';
import { getTimeAgoString } from '../../utils/datetime';
import { DateTime } from 'luxon';
import { Reading } from '../styled/readings';
import { Flex } from '../styled/flex';

const StyledDeviceCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
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
  padding: ${({ theme }) => theme.spacings.s16};
`;

export const DeviceCard = ({
  latestData,
}: {
  latestData: LatestReadingResponse;
}) => {
  const timeDiff = Math.abs(
    DateTime.fromISO(latestData.created_at).diffNow('minutes').minutes
  );
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <StyledDeviceCard>
      <TopCard>
        <Flex justifyContent="flex-end" px="s8" mb="s8">
          <Tag
            variant={tagVariant}
            text={getTimeAgoString(latestData.created_at)}
          />
        </Flex>
        <TopGrid>
          <BorderedFlex pl="s16">
            <Body>{latestData.name}</Body>
          </BorderedFlex>
          <BorderedFlex justifyContent="flex-start">
            {latestData.humidity && (
              <Reading value={latestData.humidity} unit="humidity" />
            )}
          </BorderedFlex>
          <BorderedFlex justifyContent="center">
            {latestData.pressure && (
              <Reading value={latestData.pressure} unit="pressure" />
            )}
          </BorderedFlex>
          <BorderedFlex pr="s16" justifyContent="flex-end">
            {latestData.temperature && (
              <Reading value={latestData.temperature} unit="temperature" />
            )}
          </BorderedFlex>
          <Flex pt="s16" pl="s16">
            <Caption2Light>Day</Caption2Light>
          </Flex>
          <Flex flexDirection="column" pt="s16"></Flex>
          <Flex flexDirection="column" pt="s16" alignItems="center"></Flex>
          <Flex flexDirection="column" pt="s16" pr="s16" alignItems="flex-end">
            {latestData.max_temperature && (
              <Reading
                value={latestData.max_temperature}
                unit="temperature"
                variant="max"
                sizeVariant="small"
              />
            )}
            {latestData.min_temperature && (
              <Reading
                value={latestData.min_temperature}
                unit="temperature"
                variant="min"
                sizeVariant="small"
              />
            )}
          </Flex>
        </TopGrid>
      </TopCard>
      <BottomCard />
    </StyledDeviceCard>
  );
};
