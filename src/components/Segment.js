import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { G, Path } from 'react-native-svg';
import { SegmentedArcContext } from '../SegmentedArc';
import { drawArc } from '../utils/arcHelpers';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Segment = ({ arc }) => {
  const segmentedArcContext = useContext(SegmentedArcContext);
  const { filledArcWidth, radius, isAnimated, emptyArcWidth, arcAnimatedValue } = segmentedArcContext;

  const arcRef = useRef();

  useEffect(() => {
    if (!isAnimated) return;
    const listener = arcAnimatedValue.addListener(v => {
      if (!arcRef.current) return;
      if (v.value <= arc.start) return;

      if (v.value >= arc.end) {
        arcRef.current.setNativeProps({
          d: drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.end)
        });
      } else {
        arcRef.current.setNativeProps({
          d: drawArc(arc.centerX, arc.centerY, radius, arc.start, v.value)
        });
      }
    });

    return () => arcAnimatedValue.removeListener(listener);
  }, []);

  return (
    <G>
      <Path
        fill="none"
        stroke={arc.emptyColor}
        strokeWidth={emptyArcWidth}
        d={drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.end)}
      />

      {isAnimated && arc.filled > arc.start && (
        <AnimatedPath ref={arcRef} fill="none" stroke={arc.filledColor} strokeWidth={filledArcWidth} />
      )}

      {!isAnimated && arc.filled > arc.start && (
        <Path
          fill="none"
          stroke={arc.filledColor}
          strokeWidth={filledArcWidth}
          d={drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.filled)}
        />
      )}
    </G>
  );
};

export default Segment;

Segment.propTypes = {
  arc: PropTypes.object
};
