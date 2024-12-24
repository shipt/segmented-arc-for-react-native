export const ensureDefaultSegmentScale = segments => {
  const numberOfSegmentsWithoutScale = segments.filter(segment => !segment.scale).length;
  const allocatedScale = segments.reduce((total, segment) => total + (segment.scale || 0), 0);
  const defaultArcScale = numberOfSegmentsWithoutScale > 0 ? (1 - allocatedScale) / numberOfSegmentsWithoutScale : 0;

  return segments.map(segment => (segment.scale ? segment : { ...segment, scale: defaultArcScale }));
};

export const ensureDefaultSegmentArcDegreeScale = segments => {
  const invalidArcDegreeCount = segments.filter(segment => !Number.isFinite(segment.arcDegreeScale)).length;
  const allocatedDegreeScale = segments.reduce(
    (sum, { arcDegreeScale = 0 }) => sum + (Number.isFinite(arcDegreeScale) ? arcDegreeScale : 0),
    0
  );
  const defaultArcDegreeScale = invalidArcDegreeCount > 0 ? (1 - allocatedDegreeScale) / invalidArcDegreeCount : 0;

  return segments.map(segment =>
    Number.isFinite(segment.arcDegreeScale) ? segment : { ...segment, arcDegreeScale: defaultArcDegreeScale }
  );
};

export const ensureDefaultSegmentScaleValues = segments => {
  const segmentWithValidScale = ensureDefaultSegmentScale(segments);
  const segmentsWithValidArcDegreeScale = ensureDefaultSegmentArcDegreeScale(segmentWithValidScale);
  return segmentsWithValidArcDegreeScale;
};
