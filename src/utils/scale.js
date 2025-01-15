const _isInvalidScale = value => !Number.isFinite(value) || value === 0;
const _isInvalidArcDegreeScale = value => !Number.isFinite(value);

export const ensureDefaultSegmentScale = segments => {
  let totalInvalidScaleCount = 0;
  let definedInvalidScaleCount = 0;
  segments.forEach(({ scale }) => {
    if (_isInvalidScale(scale)) {
      totalInvalidScaleCount++;
      scale !== undefined && definedInvalidScaleCount++;
    }
  });

  const allocatedScale = segments.reduce((sum, { scale }) => sum + (_isInvalidScale(scale) ? 0 : scale), 0);
  const defaultArcScale = totalInvalidScaleCount > 0 ? (1 - allocatedScale) / totalInvalidScaleCount : 0;
  const updatedSegments = segments.map(segment =>
    _isInvalidScale(segment.scale) ? { ...segment, scale: defaultArcScale } : segment
  );

  return { segments: updatedSegments, invalidScaleCount: definedInvalidScaleCount };
};

export const ensureDefaultSegmentArcDegreeScale = segments => {
  let totalInvalidArcDegreeCount = 0;
  let definedInvalidArcDegreeCount = 0;
  segments.forEach(({ arcDegreeScale }) => {
    if (_isInvalidArcDegreeScale(arcDegreeScale)) {
      totalInvalidArcDegreeCount++;
      arcDegreeScale !== undefined && definedInvalidArcDegreeCount++;
    }
  });
  const allocatedDegreeScale = segments.reduce(
    (sum, { arcDegreeScale }) => sum + (_isInvalidArcDegreeScale(arcDegreeScale) ? 0 : arcDegreeScale),
    0
  );
  const defaultArcDegreeScale =
    totalInvalidArcDegreeCount > 0 ? (1 - allocatedDegreeScale) / totalInvalidArcDegreeCount : 0;

  const updatedSegments = segments.map(segment =>
    _isInvalidArcDegreeScale(segment.arcDegreeScale) ? { ...segment, arcDegreeScale: defaultArcDegreeScale } : segment
  );

  return { segments: updatedSegments, invalidArcDegreeCount: definedInvalidArcDegreeCount };
};

export const ensureDefaultSegmentScaleValues = segments => {
  const { segments: segmentsWithValidScale, invalidScaleCount } = ensureDefaultSegmentScale(segments);
  const { segments: allValidSegments, invalidArcDegreeCount } =
    ensureDefaultSegmentArcDegreeScale(segmentsWithValidScale);

  return { segments: allValidSegments, invalidSegmentsCount: invalidScaleCount + invalidArcDegreeCount };
};
