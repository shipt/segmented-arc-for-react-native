import WarningManager from '../utils/warningManager';
import { SegmentedArcError } from './segmentedArcErrors';

export const createInvalidNumberError = (value, { propertyName, defaultValue }) => {
  return new SegmentedArcError(
    `The value '${value}' is not a valid number and has been set to the default value of ${defaultValue}${propertyName ? ` for the props "${propertyName}"` : ''}.\nPlease change to a valid numeric value.`
  );
};

export const parseNumberProps = (propertyValue, propertyName, defaultValue = 0) => {
  const { value, isInvalid } = parseNumberSafe(propertyValue, defaultValue);

  if (__DEV__ && isInvalid) {
    WarningManager.showWarning(createInvalidNumberError(propertyValue, { propertyName, defaultValue }));
  }

  return { value, isInvalid, originalValue: propertyValue };
};

export const parseNumberSafe = (value, defaultValue = 0) => {
  const parsedValue = parseFloat(value);
  const isParsedValueNaN = Number.isNaN(parsedValue);

  return { value: isParsedValueNaN ? defaultValue : parsedValue, isInvalid: isParsedValueNaN };
};
