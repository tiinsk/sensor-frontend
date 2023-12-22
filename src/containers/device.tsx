import React, { useEffect, useState } from 'react';
import api from '../api/routes';
import { useParams } from 'react-router-dom';
import { LatestReadingResponse } from '../api/types';
import { Flex } from '../components/styled/flex';
import { H2 } from '../components/styled/typography';
import { Reading } from '../components/styled/readings';
import { Tag } from '../components/styled/tag';
import { DateTime } from 'luxon';
import { getTimeAgoString } from '../utils/datetime';

export const Device = () => {
  const [latestData, setLatestData] = useState<
    LatestReadingResponse | undefined
  >(undefined);

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      const [latestData, extremesData] = await Promise.all([
        api.getAllDeviceReadingsNow(id),
        api.getAllDeviceExtremes(id),
      ]);
      if (latestData) {
        setLatestData(latestData);
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
      <Flex justifyContent="space-between" alignItems="flex-end">
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
    </div>
  );
};
