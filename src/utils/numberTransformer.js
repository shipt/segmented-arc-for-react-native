import WarningManager from '../utils/warningManager';
import { SegmentedArcError } from './segmentedArcErrors';

export const createParsedNaNError = (value, { propertyName, defaultValue }) => {
  return new SegmentedArcError(
    `The value '${value}' is not a number and has been set to the default value of ${defaultValue}${propertyName ? ` for the props "${propertyName}"` : ''}.\nPlease change to a valid numeric value.`
  );
};

export const parseNumberSafe = (value, { propertyName, defaultValue = 0 } = {}) => {
  const parsedValue = parseFloat(value);
  const isParsedValueNaN = Number.isNaN(parsedValue);
  if (__DEV__ && isParsedValueNaN) {
    WarningManager.showWarningOnce(createParsedNaNError(value, { propertyName, defaultValue }));
  }
  return isParsedValueNaN ? defaultValue : parsedValue;
};
