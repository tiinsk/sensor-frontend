import {
  TimeLevel,
  TimePeriod,
} from '../components/selectors/time-frame-selector';

export const DEFAULT_PERIOD = 'month';
export const DEFAULT_TYPE = 'temperature';

export const getDefaultTimeLevel = (
  timePeriod: TimePeriod = DEFAULT_PERIOD
): TimeLevel => {
  switch (timePeriod) {
    case 'day':
      return '30 minutes';
    case 'week':
      return 'day';
    case 'month':
      return 'day';
    case 'year':
      return 'month';
  }
};
