import React, { useEffect, useState } from 'react';
import api from '../api/routes';
import { useParams } from 'react-router-dom';
import { ExtremeResponse, LatestReadingResponse } from '../api/types';
import { Flex } from '../components/styled/flex';
import { H2 } from '../components/styled/typography';
import { Reading } from '../components/styled/readings';
import { Tag } from '../components/styled/tag';
import { DateTime } from 'luxon';
import { getTimeAgoString } from '../utils/datetime';
import { AverageCard } from '../components/cards/average-card';
import { TimeFrameSelector } from '../components/selectors/time-frame-selector';
import { Box } from '../components/styled/box';

export const Device = () => {
  const [latestData, setLatestData] = useState<
    LatestReadingResponse | undefined
  >(undefined);

  const [extremeData, setExtremeData] = useState<ExtremeResponse | undefined>(
    undefined
  );

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      const [latest, extremes] = await Promise.all([
        api.getAllDeviceReadingsNow(id),
        api.getAllDeviceExtremes(id),
      ]);
      if (latest) {
        setLatestData(latest);
      }
      if (extremes) {
        setExtremeData(extremes);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const timeDiff = latestData?.created_at
    ? Math.abs(
        DateTime.fromISO(latestData?.created_at).diffNow('minutes').minutes
      )
    : 0;
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="flex-end" mb="s16">
        <H2 mb="s4">{latestData?.name}</H2>
        <Flex flexDirection="column" alignItems="flex-end">
          {latestData?.created_at && (
            <Tag
              variant={tagVariant}
              text={getTimeAgoString(latestData.created_at)}
            />
          )}
          <Flex gap="s16">
            {latestData?.temperature && (
              <Reading value={latestData?.temperature} unit="temperature" />
            )}
            {latestData?.humidity && (
              <Reading value={latestData?.humidity} unit="humidity" />
            )}
            {latestData?.pressure && (
              <Reading value={latestData?.pressure} unit="pressure" />
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex gap="s16">
        <AverageCard
          title="Temperature"
          unit="temperature"
          day={{}}
          week={{
            min: extremeData?.min_temperature_week,
            max: extremeData?.max_temperature_week,
          }}
          month={{
            min: extremeData?.min_temperature_month,
            max: extremeData?.max_temperature_month,
          }}
        />
        <AverageCard
          title="Humidity"
          unit="humidity"
          day={{}}
          week={{
            min: extremeData?.min_humidity_week,
            max: extremeData?.max_humidity_week,
          }}
          month={{
            min: extremeData?.min_humidity_month,
            max: extremeData?.max_humidity_month,
          }}
        />
        <AverageCard
          title="Pressure"
          unit="pressure"
          day={{}}
          week={{
            min: extremeData?.min_pressure_week,
            max: extremeData?.max_pressure_week,
          }}
          month={{
            min: extremeData?.min_pressure_month,
            max: extremeData?.max_pressure_month,
          }}
        />
      </Flex>
      <Box mt="s16">
        <TimeFrameSelector onChange={() => {}} />
      </Box>
    </div>
  );
};
