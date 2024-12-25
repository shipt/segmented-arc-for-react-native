export const ensureDefaultSegmentScale = segments => {
  const isInvalidScale = value => !Number.isFinite(value) || value === 0;

  const invalidScaleCount = segments.filter(({ scale }) => isInvalidScale(scale)).length;
  const allocatedScale = segments.reduce((sum, { scale }) => sum + (isInvalidScale(scale) ? 0 : scale), 0);
  const defaultArcScale = invalidScaleCount > 0 ? (1 - allocatedScale) / invalidScaleCount : 0;

  return segments.map(segment => (isInvalidScale(segment.scale) ? { ...segment, scale: defaultArcScale } : segment));
};

export const ensureDefaultSegmentArcDegreeScale = segments => {
  const isInvalidArcDegreeScale = value => !Number.isFinite(value);

  const invalidArcDegreeCount = segments.filter(({ arcDegreeScale }) => isInvalidArcDegreeScale(arcDegreeScale)).length;
  const allocatedDegreeScale = segments.reduce(
    (sum, { arcDegreeScale }) => sum + (isInvalidArcDegreeScale(arcDegreeScale) ? 0 : arcDegreeScale),
    0
  );
  const defaultArcDegreeScale = invalidArcDegreeCount > 0 ? (1 - allocatedDegreeScale) / invalidArcDegreeCount : 0;

  return segments.map(segment =>
    isInvalidArcDegreeScale(segment.arcDegreeScale) ? { ...segment, arcDegreeScale: defaultArcDegreeScale } : segment
  );
};

export const ensureDefaultSegmentScaleValues = segments => {
  const segmentWithValidScale = ensureDefaultSegmentScale(segments);
  return ensureDefaultSegmentArcDegreeScale(segmentWithValidScale);
};
