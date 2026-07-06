import { useState } from 'react';
import { DeviceCard } from '../components/cards/device-card';
import { useDevices } from '../hooks/use-devices';
import { useLatestReadings } from '../hooks/use-latest-readings';
import { useTimeFrameData } from '../hooks/use-time-frame-data';
import styled from 'styled-components';
import {
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { Flex } from '../components/styled/flex';
import { GraphLoading } from '../assets/loading/graph-loading';
import { getDefaultTimeFrameOptions } from '../storage/time-frame';
import { getMinAndMaxGroupedByDeviceLocationType } from '../utils/readings';

const CARD_MIN_WIDTH = '450px';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${CARD_MIN_WIDTH}, 1fr));
  gap: ${({ theme }) => theme.spacings.s24};
  margin-bottom: ${({ theme }) => theme.spacings.s48};

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacings.s16};
  }
`;

export const Home = () => {
  const [options, setOptions] = useState<TimeFrameOptions>(() =>
    getDefaultTimeFrameOptions()
  );

  const { data: devices = [], isPending: isPendingDevices } = useDevices();
  const { data: latestData, isPending: isPendingLatest } = useLatestReadings();
  const {
    readingsByDevice,
    statisticsByDevice,
    isPendingReadings,
    isPendingStatistics,
  } = useTimeFrameData(options);

  const isLoadingMainContent =
    isPendingLatest || (isPendingDevices && devices.length === 0);

  const minMax = getMinAndMaxGroupedByDeviceLocationType(
    devices,
    readingsByDevice
  );

  return (
    <>
      <TimeFrameSelector
        options={options}
        onChange={setOptions}
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
              type={device.type}
              options={options}
              latestData={latestData?.byDevice[device.id]}
              statisticsData={statisticsByDevice[device.id]}
              readingsData={readingsByDevice[device.id]?.values}
              minMax={minMax[device.location.type || device.id]}
              isLoadingMainContent={isLoadingMainContent}
              isLoadingReadings={isPendingReadings}
              isLoadingStatistics={isPendingStatistics}
              timezone={device.timezone}
            />
          ))}
        </CardGrid>
      )}
    </>
  );
};
