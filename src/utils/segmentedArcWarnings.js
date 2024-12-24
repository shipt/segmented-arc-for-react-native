import { SegmentedArcError } from './segmentedArcErrors';
import WarningManager from './warningManager';

const isInvalidScalePercent = value => value !== undefined && (Number.isNaN(value) || value < 0 || value > 1);
const isInvalidAllocatedScalePercent = total => Number.isNaN(total) || total < 0 || total > 1;

export const createInvalidScaleValueError = (propertyName, value) => {
  return new SegmentedArcError(
    `Each '${propertyName}' value should be a positive number between 0 and 1 inclusive. It was found ${value}`
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
    allocatedScale += segment.scale ?? 0;
    allocatedArcDegreeScale += segment.arcDegreeScale ?? 0;
    if (isInvalidScalePercent(segment.scale)) {
      WarningManager.showWarningOnce(createInvalidScaleValueError('scale', segment.scale));
    }
    if (isInvalidScalePercent(segment.arcDegreeScale)) {
      WarningManager.showWarningOnce(createInvalidScaleValueError('arcDegreeScale', segment.arcDegreeScale));
    }
  });

  if (isInvalidAllocatedScalePercent(allocatedScale)) {
    WarningManager.showWarningOnce(createAllocatedScaleError('scale', allocatedScale));
  }
  if (isInvalidAllocatedScalePercent(allocatedArcDegreeScale)) {
    WarningManager.showWarningOnce(createAllocatedScaleError('arcDegreeScale', allocatedArcDegreeScale));
  }
};
