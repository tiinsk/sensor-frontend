import { useLatestReadings } from '../../hooks/use-latest-readings';
import { Card } from '../../components/styled/v2/card';
import { Scale } from '../../components/styled/v2/scale';
import styled from 'styled-components';
import { Flex } from '../../components/styled/flex';
import { Reading } from '../../components/styled/readings/v2';
import { H4 } from '../../components/styled/v2/typography';
import { getLocationTitle } from '../../utils/location';

const ReadingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacings.s8};
`;

export const Home = () => {
  const { data: latestData, isPending: isPendingLatest } = useLatestReadings();

  //TODO add loading, error states etc.
  return (
    <Flex gap="s16" style={{ width: '100%' }}>
      {latestData &&
        latestData.byLocationType.map(stats => (
          <Flex
            key={stats.locationType}
            flex="1"
            flexDirection="column"
            gap="s16"
          >
            <H4>{getLocationTitle(stats.locationType)}</H4>
            <Flex gap="s16" style={{ width: '100%' }}>
              {stats.airQuality.avg !== null && (
                <Flex flex="1">
                  <Card style={{ display: 'flex', justifyContent: 'center' }}>
                    <Flex gap="s16">
                      <Scale
                        value={stats.airQuality.avg || 0}
                        unit="airQuality"
                      />
                      <ReadingsGrid>
                        <Reading
                          unit="co2"
                          value={stats.co2.avg}
                          showTitle={true}
                        />
                        <Reading
                          unit="pm25"
                          value={stats.pm25.avg}
                          showTitle={true}
                        />
                        <Reading
                          unit="nox"
                          value={stats.nox.avg}
                          showTitle={true}
                        />
                        <Reading
                          unit="voc"
                          value={stats.voc.avg}
                          showTitle={true}
                        />
                      </ReadingsGrid>
                    </Flex>
                  </Card>
                </Flex>
              )}
              <Flex flex="1">
                <Card style={{ display: 'flex', justifyContent: 'center' }}>
                  <Flex gap="s16">
                    <Scale
                      value={stats.temperature.avg || 0}
                      min={stats.temperature.min}
                      max={stats.temperature.max}
                      unit="temperature"
                    />
                    <Scale
                      value={stats.pressure.avg || 0}
                      min={stats.pressure.min}
                      max={stats.pressure.max}
                      unit="pressure"
                    />
                    <Scale
                      value={stats.humidity.avg || 0}
                      min={stats.humidity.min}
                      max={stats.humidity.max}
                      unit="humidity"
                    />
                  </Flex>
                </Card>
              </Flex>
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
