import {
  ArrayResponse,
  DeviceReadingResponse,
  DeviceResponse,
  LatestReadingResponse,
  ReadingsResponse,
  StatisticsResponse,
} from './types';
import { api } from './index';
import {
  ValueType,
} from '../components/selectors/time-frame-selector';
import { ReadingsTimeFrame } from '../components/selectors/time-frames';

interface TimeParams {
  startTime: string;
  endTime: string;
}

type ReadingParams = ReadingsTimeFrame & { type: ValueType };
type DeviceReadingParams = ReadingsTimeFrame & {
  deviceId: string;
  types: ValueType[];
};

const routes = {
  login: (payload: { username: string; password: string }) =>
    api.post<{ token: string }>({ route: '/login', payload }, false),
  extendSession: () =>
    api.post<{ token: string }>({ route: '/session/extend' }),
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
      params,
    }),
  getDeviceReadings: ({
    deviceId,
    ...params
  }: DeviceReadingParams) =>
    api.get<DeviceReadingResponse>({
      route: `/devices/${deviceId}/readings`,
      params,
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
    api.post<DeviceResponse>({ route: '/devices', payload }),
  editDevice: (deviceId: string, payload: Omit<DeviceResponse, 'id'>) =>
    api.put<DeviceResponse>({
      route: `/devices/${deviceId}`,
      payload,
    }),
};

export default routes;
