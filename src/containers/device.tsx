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
import { getTimeAgoString } from '../utils/datetime';
import { AverageCard } from '../components/cards/average-card';
import {
  DEFAULT_PERIOD,
  TimeFrameOptions,
  TimeFrameSelector,
} from '../components/selectors/time-frame-selector';
import { Box } from '../components/styled/box';
import styled from 'styled-components';
import { Graph } from '../components/graphs/graph';
import { GraphSizeWrapper } from '../components/graphs/graph-size-wrapper';
import { GraphLoading } from '../assets/loading/graph-loading';
import {
  getDefaultTimeLevel,
  getEndTime,
  getStartTime,
  getTimeFrame,
} from '../components/selectors/time-frames';

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacings.s16};

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacings.s16};
  }
`;

const AverageWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacings.s16};

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }
`;

const LatestReadings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${({ theme }) => theme.mediaQueries.sm} {
    align-items: flex-start;
  }
`;

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

export const Device = () => {
  const [hoveredDate, setHoveredDate] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<TimeFrameOptions>(() => ({
    offsetFromNow: 0,
    timePeriod: DEFAULT_PERIOD,
    level: getDefaultTimeLevel(),
    showMinAndMax: true,
  }));
  const [latestData, setLatestData] = useState<
    LatestReadingResponse | undefined
  >(undefined);

  const [statisticsData, setStatisticsData] = useState<{
    day: Statistics | undefined;
    week: Statistics | undefined;
    month: Statistics | undefined;
  }>({ day: undefined, week: undefined, month: undefined });

  const [isLoadingReadings, setLoadingReadings] = useState<boolean>(false);
  const [isLoadingMainContent, setLoadingMainContent] =
    useState<boolean>(false);
  const [readingData, setReadingData] = useState<
    { [type: string]: ReadingType[] | undefined } | undefined
  >(undefined);

  const { id } = useParams();
  const fetchData = async () => {
    if (id) {
      setLoadingMainContent(true);
      const [latest, statisticsDay, statisticsWeek, statisticsMonth] =
        await Promise.all([
          api.getDeviceLatestReadings(id),
          api.getAllDeviceStatistics({
            startTime: getStartTime(0, 'day')!,
            endTime: getEndTime(0, 'day')!,
            deviceId: id,
          }),
          api.getAllDeviceStatistics({
            startTime: getStartTime(0, 'week')!,
            endTime: getEndTime(0, 'week')!,
            deviceId: id,
          }),
          api.getAllDeviceStatistics({
            startTime: getStartTime(0, 'month')!,
            endTime: getEndTime(0, 'month')!,
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
      setLoadingMainContent(false);
    }
  };

  const fetchReadings = async () => {
    if (id) {
      const { graphStartTime, graphEndTime } = getTimeFrame(options);

      const readings = await api.getDeviceReadings({
        deviceId: id,
        startTime: graphStartTime,
        endTime: graphEndTime,
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
      setLoadingReadings(false);
    }
  };

  useEffect(() => {
    setReadingData(undefined);
    fetchData();
  }, [id]);

  useEffect(() => {
    setReadingData(undefined);
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
      <TitleWrapper>
        <H2 mb="s4" isLoading={!latestData?.name} loadingWidth="s192">
          {latestData?.name}
        </H2>
        <LatestReadings>
          <Tag
            variant={tagVariant}
            text={getTimeAgoString(latestData?.reading.created_at)}
            isLoading={isLoadingMainContent}
          />
          <Flex gap="s16" style={{ minWidth: '250px' }}>
            <Reading
              value={latestData?.reading.temperature}
              unit="temperature"
              isLoading={isLoadingMainContent}
            />
            <Reading
              value={latestData?.reading.humidity}
              unit="humidity"
              isLoading={isLoadingMainContent}
            />
            <Reading
              value={latestData?.reading.pressure}
              unit="pressure"
              isLoading={isLoadingMainContent}
            />
          </Flex>
        </LatestReadings>
      </TitleWrapper>
      <AverageWrapper>
        <AverageCard
          title="Temperature"
          unit="temperature"
          day={statisticsData.day?.temperature || {}}
          week={statisticsData.week?.temperature || {}}
          month={statisticsData.month?.temperature || {}}
          isLoading={isLoadingMainContent}
        />
        <AverageCard
          title="Humidity"
          unit="humidity"
          day={statisticsData.day?.humidity || {}}
          week={statisticsData.week?.humidity || {}}
          month={statisticsData.month?.humidity || {}}
          isLoading={isLoadingMainContent}
        />
        <AverageCard
          title="Pressure"
          unit="pressure"
          day={statisticsData.day?.pressure || {}}
          week={statisticsData.week?.pressure || {}}
          month={statisticsData.month?.pressure || {}}
          isLoading={isLoadingMainContent}
        />
      </AverageWrapper>
      <Box mt="s16">
        <TimeFrameSelector
          options={options}
          selectors={['timePeriod']}
          onChange={newOptions => {
            setOptions(newOptions);
            setReadingData(undefined);
          }}
        />
      </Box>
      <StyledGraphCard>
        {isLoadingReadings || readingData === undefined ? (
          <Flex
            style={{ height: '600px' }}
            justifyContent="center"
            alignItems="center"
          >
            <GraphLoading />
          </Flex>
        ) : (
          <>
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
          </>
        )}
      </StyledGraphCard>
    </div>
  );
};
