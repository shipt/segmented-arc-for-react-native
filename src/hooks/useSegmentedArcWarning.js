import { useEffect, useRef } from 'react';
import { warnAboutInvalidSegmentsData } from '../utils/segmentedArcWarnings';

export const useShowSegmentedArcWarnings = ({ segments }) => {
  const { current: currentSegments } = useRef(segments);

  useEffect(() => {
    if (!__DEV__) return;

    warnAboutInvalidSegmentsData(currentSegments);
  }, [currentSegments]);
};
