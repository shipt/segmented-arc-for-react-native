const _isInvalidScale = value => !Number.isFinite(value) || value === 0;
const _isInvalidArcDegreeScale = value => !Number.isFinite(value);

export const ensureDefaultSegmentScale = segments => {
  const invalidScaleCount = segments.filter(({ scale }) => _isInvalidScale(scale)).length;
  const allocatedScale = segments.reduce((sum, { scale }) => sum + (_isInvalidScale(scale) ? 0 : scale), 0);
  const defaultArcScale = invalidScaleCount > 0 ? (1 - allocatedScale) / invalidScaleCount : 0;

  return segments.map(segment => (_isInvalidScale(segment.scale) ? { ...segment, scale: defaultArcScale } : segment));
};

export const ensureDefaultSegmentArcDegreeScale = segments => {
  const invalidArcDegreeCount = segments.filter(({ arcDegreeScale }) =>
    _isInvalidArcDegreeScale(arcDegreeScale)
  ).length;
  const allocatedDegreeScale = segments.reduce(
    (sum, { arcDegreeScale }) => sum + (_isInvalidArcDegreeScale(arcDegreeScale) ? 0 : arcDegreeScale),
    0
  );
  const defaultArcDegreeScale = invalidArcDegreeCount > 0 ? (1 - allocatedDegreeScale) / invalidArcDegreeCount : 0;

  return segments.map(segment =>
    _isInvalidArcDegreeScale(segment.arcDegreeScale) ? { ...segment, arcDegreeScale: defaultArcDegreeScale } : segment
  );
};

export const ensureDefaultSegmentScaleValues = segments => {
  const segmentsWithValidScale = ensureDefaultSegmentScale(segments);
  const segmentsWithValidScaleAndArcDegreeScale = ensureDefaultSegmentArcDegreeScale(segmentsWithValidScale);
  const invalidSegments = segments.filter(segment => {
    return (
      (segment.scale !== undefined && _isInvalidScale(segment.scale)) ||
      (segment.arcDegreeScale !== undefined && _isInvalidArcDegreeScale(segment.arcDegreeScale))
    );
  });

  return { segments: segmentsWithValidScaleAndArcDegreeScale, invalidSegments };
};
