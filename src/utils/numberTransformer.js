import WarningManager from '../utils/warningManager';
import { SegmentedArcError } from './segmentedArcErrors';

export const createInvalidNumberError = (value, { propertyName, defaultValue }) => {
  return new SegmentedArcError(
    `The value '${value}' is not a valid number and has been set to the default value of ${defaultValue} for the props "${propertyName}".\nPlease change to a valid numeric value.`
  );
};

export const parseNumberProps = (propertyValue, propertyName, defaultValue = 0) => {
  const { value, isInvalid } = parseFiniteNumberOrDefault(propertyValue, defaultValue);

  if (__DEV__ && isInvalid) {
    WarningManager.showWarning(createInvalidNumberError(propertyValue, { propertyName, defaultValue }));
  }

  return { value, isInvalid, originalValue: propertyValue };
};

export const parseFiniteNumberOrDefault = (value, defaultValue = 0) => {
  const parsedValue = parseFloat(value);
  const isParsedValueNonFinite = !Number.isFinite(parsedValue);

  return { value: isParsedValueNonFinite ? defaultValue : parsedValue, isInvalid: isParsedValueNonFinite };
};
