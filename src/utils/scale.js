export const ensureDefaultSegmentScale = segments => {
  const numberOfSegmentsWithoutScale = segments.filter(segment => !segment.scale).length;
  const allocatedScale = segments.reduce((total, segment) => total + (segment.scale || 0), 0);
  const defaultArcScale = numberOfSegmentsWithoutScale > 0 ? (1 - allocatedScale) / numberOfSegmentsWithoutScale : 0;

  return segments.map(segment => (segment.scale ? segment : { ...segment, scale: defaultArcScale }));
};
