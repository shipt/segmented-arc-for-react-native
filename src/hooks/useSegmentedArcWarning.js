import { useEffect, useRef } from 'react';
import { warnAboutInvalidSegmentsData } from '../utils/segmentedArcWarnings';

export const useShowSegmentedArcWarnings = ({ segments }) => {
  // Conditionally render hook, because this is not useful in production
  if (!__DEV__) return;

  const { current: currentSegments } = useRef(segments);

  useEffect(() => {
    warnAboutInvalidSegmentsData(currentSegments);
  }, [currentSegments]);
};
