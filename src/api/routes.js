const api = require('./index');
const {DateTime} = require('luxon');

const getTimeZone = () => {
  return DateTime.fromJSDate(new Date()).get('offset')/60;
};

export default {
  getNow: () =>  api.get({route: `/readings/now?localTimeZone=${getTimeZone()}`}),
  getExtremes: () =>  api.get({route: `/readings/extremes?localTimeZone=${getTimeZone()}`}),
  getAllReadings: (deviceId, params) => api.get({
    route: `/devices/${deviceId}/readings`,
    params
  }),
  getAllDevices: () => api.get({route: '/devices'}),
  getAllDeviceReadingsNow: (deviceId) => api.get({
    route: `/devices/${deviceId}/readings/now?localTimeZone=${getTimeZone()}`
  }),
  getAllDeviceExtremes: (deviceId) => api.get({
    route: `/devices/${deviceId}/readings/extremes?localTimeZone=${getTimeZone()}`
  }),
};
