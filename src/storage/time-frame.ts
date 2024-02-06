import { getStorageItem, setStorageItem } from './index';
import {
  TimePeriod,
  ValueType,
} from '../components/selectors/time-frame-selector';
import {
  DEFAULT_PERIOD,
  DEFAULT_TYPE,
  getDefaultTimeLevel,
} from '../utils/time-frame';

interface StoredTimeFrame {
  timePeriod?: TimePeriod;
  valueType?: ValueType;
  showMinAndMax?: boolean;
}

export const getStorageTimeFrame = () => {
  const savedTimeFrame = getStorageItem('time-frame');
  return savedTimeFrame
    ? (JSON.parse(savedTimeFrame) as StoredTimeFrame)
    : undefined;
};

export const saveStorageTimeFrame = (timeFrame: StoredTimeFrame) => {
  setStorageItem('time-frame', timeFrame);
};

export const getDefaultTimeFrameOptions = () => {
  const savedTimeFrame = getStorageTimeFrame();
  return {
    offsetFromNow: 0,
    timePeriod: savedTimeFrame?.timePeriod || DEFAULT_PERIOD,
    valueType: savedTimeFrame?.valueType || DEFAULT_TYPE,
    level: getDefaultTimeLevel(savedTimeFrame?.timePeriod),
    showMinAndMax: savedTimeFrame?.showMinAndMax ?? true,
  };
};
