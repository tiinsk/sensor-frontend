import React, { useEffect, useState } from 'react';
import api from '../api/routes';
import { Reading as ReadingType } from '../api/types';
import { useParams } from 'react-router-dom';
import { LatestReadingResponse, Statistics } from '../api/types';
import { Flex } from '../components/styled/flex';
import { H2 } from '../components/styled/typography';
import { Reading } from '../components/styled/readings';
import { Tag } from '../components/styled/tag';
import { DateTime } from 'luxon';
import { getTimeAgoString, getUTCTime } from '../utils/datetime';
import { AverageCard } from '../components/cards/average-card';
import {
  getDefaultTimeLevel,
  getEndTime,
  getStartTime,
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { Box } from '../components/styled/box';
import styled from 'styled-components';
import { Graph } from '../components/graphs/graph';
import { GraphSizeWrapper } from '../components/graphs/graph-size-wrapper';

const StyledGraphCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  border-bottom: none;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  margin-bottom: ${({ theme }) => theme.spacings.s16};
`;

const StyledGraphContainer = styled.div`
  height: 200px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;

const DEFAULT_PERIOD = 'month';

export const Device = () => {
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);
  const timeNow = new Date().toISOString();
  const [options, setOptions] = useState<TimeFrameOptions>({
    endTime: getEndTime(timeNow, DEFAULT_PERIOD)!,
    startTime: getStartTime(timeNow, DEFAULT_PERIOD)!,
    timePeriod: DEFAULT_PERIOD,
    level: getDefaultTimeLevel(DEFAULT_PERIOD),
    showMinAndMax: true,
  });
  const [latestData, setLatestData] = useState<
    LatestReadingResponse | undefined
  >(undefined);

  const [statisticsData, setStatisticsData] = useState<{
    day: Statistics | undefined;
    week: Statistics | undefined;
    month: Statistics | undefined;
  }>({ day: undefined, week: undefined, month: undefined });

  const [readingData, setReadingData] = useState<
    { [type: string]: ReadingType[] | undefined } | undefined
  >(undefined);

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      const now = new Date().toISOString();

      const [latest, statisticsDay, statisticsWeek, statisticsMonth] =
        await Promise.all([
          api.getDeviceLatestReadings(id),
          api.getAllDeviceStatistics({
            startTime: getUTCTime(getStartTime(now, 'day')!),
            endTime: getUTCTime(getEndTime(now, 'day')!),
            deviceId: id,
          }),
          api.getAllDeviceStatistics({
            startTime: getUTCTime(getStartTime(now, 'week')!),
            endTime: getUTCTime(getEndTime(now, 'week')!),
            deviceId: id,
          }),
          api.getAllDeviceStatistics({
            startTime: getUTCTime(getStartTime(now, 'month')!),
            endTime: getUTCTime(getEndTime(now, 'month')!),
            deviceId: id,
          }),
        ]);
      if (latest) {
        setLatestData(latest);
      }

      setStatisticsData({
        day: statisticsDay?.statistics,
        week: statisticsWeek?.statistics,
        month: statisticsMonth?.statistics,
      });
    }
  };

  const fetchReadings = async () => {
    if (id) {
      const startTime = getUTCTime(options.startTime);
      const endTime = getUTCTime(options.endTime);

      const readings = await api.getDeviceReadings({
        deviceId: id,
        startTime,
        endTime,
        types: ['temperature', 'humidity', 'pressure'],
        level: options.level,
      });

      const readingsByType = readings?.values.reduce<{
        [type: string]: ReadingType[] | undefined;
      }>((acc, cur) => {
        acc[cur.type] = cur.values;
        return acc;
      }, {});
      setReadingData(readingsByType);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    fetchReadings();
  }, [id, options]);

  const timeDiff = latestData?.reading.created_at
    ? Math.abs(
        DateTime.fromISO(latestData?.reading.created_at).diffNow('minutes')
          .minutes
      )
    : 0;
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="flex-end" mb="s16">
        <H2 mb="s4">{latestData?.name}</H2>
        <Flex flexDirection="column" alignItems="flex-end">
          {latestData?.reading.created_at && (
            <Tag
              variant={tagVariant}
              text={getTimeAgoString(latestData.reading.created_at)}
            />
          )}
          <Flex gap="s16">
            {latestData?.reading.temperature && (
              <Reading
                value={latestData?.reading.temperature}
                unit="temperature"
              />
            )}
            {latestData?.reading.humidity && (
              <Reading value={latestData?.reading.humidity} unit="humidity" />
            )}
            {latestData?.reading.pressure && (
              <Reading value={latestData?.reading.pressure} unit="pressure" />
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex gap="s16">
        <AverageCard
          title="Temperature"
          unit="temperature"
          day={statisticsData.day?.temperature || {}}
          week={statisticsData.week?.temperature || {}}
          month={statisticsData.month?.temperature || {}}
        />
        <AverageCard
          title="Humidity"
          unit="humidity"
          day={statisticsData.day?.humidity || {}}
          week={statisticsData.week?.humidity || {}}
          month={statisticsData.month?.humidity || {}}
        />
        <AverageCard
          title="Pressure"
          unit="pressure"
          day={statisticsData.day?.pressure || {}}
          week={statisticsData.week?.pressure || {}}
          month={statisticsData.month?.pressure || {}}
        />
      </Flex>
      <Box mt="s16">
        <TimeFrameSelector
          options={options}
          selectors={['timePeriod']}
          onChange={newOptions => setOptions(newOptions)}
        />
      </Box>
      <StyledGraphCard>
        <StyledGraphContainer>
          {id && readingData?.temperature && (
            <GraphSizeWrapper>
              <Graph
                deviceId={id}
                data={readingData.temperature}
                options={options}
                valueType="temperature"
                showAxis={false}
                hoveredDate={hoveredDate}
                onHover={date => setHoveredDate(date)}
              />
            </GraphSizeWrapper>
          )}
        </StyledGraphContainer>
        <StyledGraphContainer>
          {id && readingData?.humidity && (
            <GraphSizeWrapper>
              <Graph
                deviceId={id}
                data={readingData.humidity}
                options={options}
                valueType="humidity"
                showAxis={false}
                hoveredDate={hoveredDate}
                onHover={date => setHoveredDate(date)}
              />
            </GraphSizeWrapper>
          )}
        </StyledGraphContainer>
        <StyledGraphContainer>
          {id && readingData?.pressure && (
            <GraphSizeWrapper>
              <Graph
                deviceId={id}
                data={readingData.pressure}
                options={options}
                valueType="pressure"
                hoveredDate={hoveredDate}
                onHover={date => setHoveredDate(date)}
              />
            </GraphSizeWrapper>
          )}
        </StyledGraphContainer>
      </StyledGraphCard>
    </div>
  );
};
