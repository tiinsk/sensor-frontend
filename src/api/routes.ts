import {
  ArrayResponse,
  DeviceResponse,
  ExtremeResponse,
  LatestReadingResponse,
} from './types';
import * as api from './index';
const { DateTime } = require('luxon');

const getTimeZone = () => {
  return DateTime.fromJSDate(new Date()).get('offset') / 60;
};

const routes = {
  login: (payload: any) => api.post({ route: '/login', payload }),
  getAllLatest: () =>
    api.get<LatestReadingResponse[]>({
      route: `/readings/now?localTimeZone=${getTimeZone()}`,
    }),
  getExtremes: () =>
    api.get({ route: `/readings/extremes?localTimeZone=${getTimeZone()}` }),
  getAllReadings: (deviceId: string, params: any) =>
    api.get({
      route: `/devices/${deviceId}/readings`,
      params,
    }),
  getAllDevices: () =>
    api.get<ArrayResponse<DeviceResponse>>({ route: '/devices' }),
  getAllDeviceReadingsNow: (deviceId: string) =>
    api.get<LatestReadingResponse>({
      route: `/devices/${deviceId}/readings/now?localTimeZone=${getTimeZone()}`,
    }),
  getAllDeviceExtremes: (deviceId: string) =>
    api.get<ExtremeResponse>({
      route: `/devices/${deviceId}/readings/extremes?localTimeZone=${getTimeZone()}`,
    }),
};

export default routes;
