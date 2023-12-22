import React from 'react';
import styled from 'styled-components';
import { LatestReadingResponse } from '../../api/types';
import { Body } from '../styled/typography';
import { Tag } from '../styled/tag';
import { getTimeAgoString } from '../../utils/datetime';
import { DateTime } from 'luxon';
import { Box } from '../styled/box';
import { Reading } from '../styled/readings';

const StyledDeviceCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
`;
const TopCard = styled.div`
  padding: ${({ theme }) => theme.spacings.s16};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
        <Box mt="s8">
          <Body>{latestData.name}</Body>
          <Tag
            variant={tagVariant}
            text={getTimeAgoString(latestData.created_at)}
          />
        </Box>
        <Box>
          {latestData.humidity && (
            <Reading value={latestData.humidity} unit="humidity" />
          )}
        </Box>
        <Box>
          {latestData.pressure && (
            <Reading value={latestData.pressure} unit="pressure" />
          )}
        </Box>
        <Box>
          {latestData.temperature && (
            <Reading value={latestData.temperature} unit="temperature" />
          )}
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
        </Box>
      </TopCard>
      <BottomCard>Graph not yet implemented</BottomCard>
    </StyledDeviceCard>
  );
};
