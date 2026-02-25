import {
  ArrayResponse,
  DeviceReadingResponse,
  DeviceResponse,
  LatestReadingResponse,
  PostResponse,
  ReadingsResponse,
  StatisticsResponse,
} from './types';
import * as api from './index';
import {
  TimeLevel,
  ValueType,
} from '../components/selectors/time-frame-selector';
const { DateTime } = require('luxon');

const getTimeZone = () => {
  return DateTime.fromJSDate(new Date()).get('offset') / 60;
};

interface TimeParams {
  startTime: string;
  endTime: string;
}

interface ReadingParams extends TimeParams {
  type: ValueType;
  level: TimeLevel;
}

const routes = {
  login: (payload: { username: string; password: string }) =>
    api.post<{ token: string }>({ route: '/login', payload }, false),
  getAllLatest: () =>
    api.get<ArrayResponse<LatestReadingResponse>>({
      route: `/latest`,
    }),
  getAllStatistics: (params: TimeParams) =>
    api.get<ArrayResponse<StatisticsResponse>>({
      route: `/statistics`,
      params,
    }),
  getAllReadings: (params: ReadingParams) =>
    api.get<ArrayResponse<ReadingsResponse>>({
      route: `/readings`,
      params: {
        timezone: 'Europe/Helsinki',
        ...params,
      },
    }),
  getDeviceReadings: ({
    deviceId,
    ...params
  }: TimeParams & { deviceId: string; types: ValueType[]; level: TimeLevel }) =>
    api.get<DeviceReadingResponse>({
      route: `/devices/${deviceId}/readings`,
      params: {
        //TODO change to detect users local timezone, hardcoded for now.
        timezone: 'Europe/Helsinki',
        ...params,
      },
    }),
  getAllDevices: (params?: { includeDisabled?: boolean }) =>
    api.get<ArrayResponse<DeviceResponse>>({ route: '/devices', params }),
  getDevice: (deviceId: string) =>
    api.get<DeviceResponse>({ route: `/devices/${deviceId}` }),
  getDeviceLatestReadings: (deviceId: string) =>
    api.get<LatestReadingResponse>({
      route: `/devices/${deviceId}/latest`,
    }),
  getAllDeviceStatistics: ({
    deviceId,
    ...params
  }: {
    startTime: string;
    endTime: string;
    deviceId: string;
  }) =>
    api.get<StatisticsResponse>({
      route: `/devices/${deviceId}/statistics`,
      params,
    }),
  addDevice: (payload: DeviceResponse) =>
    api.post<PostResponse<DeviceResponse>>(
      { route: '/devices', payload },
      true
    ),
  editDevice: (deviceId: string, payload: Omit<DeviceResponse, 'id'>) =>
    api.put<PostResponse<DeviceResponse>>({
      route: `/devices/${deviceId}`,
      payload,
    }),
};

export default routes;
