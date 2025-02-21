import { parseNumberProps } from './numberTransformer';
import { ensureDefaultSegmentScaleValues } from './scaleHelpers';

/**
 * Validates and processes properties related to segments and numeric fields.
 *
 * @param {Object} props
 * @param {Array} props.segmentsProps
 * @param {Object<string, {value: (number), defaultValue: number}>} props.numericPropsConfig
 * @returns {{
 *   dataErrors: Object,
 *   segments: Array<Object>,
 *   fillValue: number,
 *   filledArcWidth: number,
 *   emptyArcWidth: number,
 *   spaceBetweenSegments: number,
 *   arcDegree: number,
 *   radius: number
 * }} The validated and processed props.
 */
export const validateProps = ({ segmentsProps, numericPropsConfig }) => {
  const { segments, invalidSegments } = ensureDefaultSegmentScaleValues(segmentsProps);
  const numericPropsWithValidation = _ensureValidNumericProps(numericPropsConfig);
  const dataErrors = _getDataErrors(numericPropsWithValidation, invalidSegments);

  return {
    dataErrors,
    segments,
    ..._extractValidNumericValues(numericPropsWithValidation)
  };
};

const _ensureValidNumericProps = numericPropsConfig => {
  const processedFields = {};
  for (const [propertyName, { value, defaultValue }] of Object.entries(numericPropsConfig)) {
    const config = parseNumberProps(value, propertyName, defaultValue);
    processedFields[propertyName] = config;
  }

  return processedFields;
};

const _extractValidNumericValues = numericPropsWithValidation => {
  const validNumericProps = {};
  for (const [key, { value }] of Object.entries(numericPropsWithValidation)) {
    validNumericProps[key] = value;
  }

  return validNumericProps;
};

const _getDataErrors = (numericPropsWithValidation, invalidSegments) => {
  let dataErrors = {};

  if (invalidSegments.length > 0) {
    dataErrors.segments = invalidSegments;
  }

  Object.entries(numericPropsWithValidation).forEach(([key, { originalValue, isInvalid }]) => {
    if (isInvalid) {
      dataErrors[key] = originalValue;
    }
  });

  return dataErrors;
};
