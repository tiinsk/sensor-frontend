import { useState } from 'react';
import {
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { MapSvg } from '../assets/map';
import styled from 'styled-components';
import { H3 } from '../components/styled/typography';
import { Flex } from '../components/styled/flex';
import { MapReading } from '../components/map/map-reading';
import { GraphLoading } from '../assets/loading/graph-loading';
import { getDefaultTimeFrameOptions } from '../storage/time-frame';
import { getDefaultTimeLevel } from '../utils/time-frame';
import { useDevices } from '../hooks/use-devices';
import { useLatestReadings } from '../hooks/use-latest-readings';
import { useStatistics } from '../hooks/use-statistics';

const MapCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  padding: ${({ theme }) => theme.spacings.s24};
  padding-bottom: ${({ theme }) => theme.spacings.s48};

  background-image:
    repeating-linear-gradient(
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
    min-width: fit-content;
    width: 100%;
  }
`;

const CardWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    overflow-x: auto;
    margin-left: -${({ theme }) => theme.spacings.s48};
    margin-right: -${({ theme }) => theme.spacings.s48};
    padding-bottom: ${({ theme }) => theme.spacings.s16};
    margin-bottom: ${({ theme }) => theme.spacings.s40};

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
    ...getDefaultTimeFrameOptions(),
    timePeriod: 'day',
    level: getDefaultTimeLevel(),
    showMinAndMax: true,
  }));

  const { data: devices = [], isPending: isPendingDevices } = useDevices();
  const { data: latestData, isPending: isPendingLatest } = useLatestReadings();
  const { data: statisticsByDevice = {}, isPending: isPendingStatistics } =
    useStatistics(options);

  const isLoadingDevices = isPendingDevices && devices.length === 0;
  const isLoadingPins =
    isPendingStatistics || (options.offsetFromNow === 0 && isPendingLatest);

  const valueType = options.valueType || 'temperature';

  return (
    <div>
      <TimeFrameSelector
        options={options}
        onChange={setOptions}
        selectors={['valueType']}
      />
      <CardWrapper>
        <MapCard>
          <H3>Map</H3>
          <Flex mt="s40" justifyContent="center" alignItems="center">
            <MapWrapper>
              <MapSvg
                style={{
                  opacity: isLoadingDevices ? 0.25 : 1,
                }}
              />
              {isLoadingDevices ? (
                <LoadingWrapper>
                  <GraphLoading />
                </LoadingWrapper>
              ) : (
                devices.map(device => {
                  const latest = latestData?.byDevice[device.id];
                  const statistics = statisticsByDevice[device.id]?.statistics;
                  const reading =
                    options.offsetFromNow === 0
                      ? {
                          avg: latest?.reading?.[valueType],
                          min: statistics?.[valueType].min,
                          max: statistics?.[valueType].max,
                          timestamp: latest?.reading?.timestamp,
                        }
                      : {
                          avg: statistics?.[valueType].avg,
                          min: statistics?.[valueType].min,
                          max: statistics?.[valueType].max,
                          timestamp: undefined,
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
                        unit={valueType}
                        title={device.name}
                        isLoading={isLoadingPins}
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
