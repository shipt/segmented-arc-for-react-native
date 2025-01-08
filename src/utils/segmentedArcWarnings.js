import { SegmentedArcError } from './segmentedArcErrors';
import WarningManager from './warningManager';

const _isInvalidScalePercent = value => {
  if (value === undefined) return false;
  if (!Number.isFinite(value)) return true;
  const roundedValue = Number(value.toFixed(4));
  return roundedValue < 0 || roundedValue > 1;
};

const _isInvalidAllocatedScalePercent = total => {
  if (!Number.isFinite(total)) return true;
  const roundedTotal = Number(total.toFixed(4));
  return roundedTotal < 0 || roundedTotal > 1;
};

export const createInvalidScaleValueError = (propertyName, value) => {
  return new SegmentedArcError(
    `Each '${propertyName}' value should be a positive number between 0 and 1 inclusive. ${value} was provided instead`
  );
};

export const createAllocatedScaleError = (propertyName, total) => {
  return new SegmentedArcError(
    `The allocated '${propertyName}' sum is expected to be between 0 and 1 inclusive, not ${total}`
  );
};

export const warnAboutInvalidSegmentsData = segments => {
  if (!segments || segments.length === 0) {
    return;
  }

  let allocatedScale = 0;
  let allocatedArcDegreeScale = 0;
  segments.forEach(segment => {
    allocatedScale += Number.isFinite(segment.scale) ? segment.scale : 0;
    allocatedArcDegreeScale += Number.isFinite(segment.arcDegreeScale) ? segment.arcDegreeScale : 0;
    if (_isInvalidScalePercent(segment.scale)) {
      WarningManager.showWarning(createInvalidScaleValueError('scale', segment.scale));
    }
    if (_isInvalidScalePercent(segment.arcDegreeScale)) {
      WarningManager.showWarning(createInvalidScaleValueError('arcDegreeScale', segment.arcDegreeScale));
    }
  });

  if (_isInvalidAllocatedScalePercent(allocatedScale)) {
    WarningManager.showWarning(createAllocatedScaleError('scale', allocatedScale));
  }
  if (_isInvalidAllocatedScalePercent(allocatedArcDegreeScale)) {
    WarningManager.showWarning(createAllocatedScaleError('arcDegreeScale', allocatedArcDegreeScale));
  }
};
