import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { G, Path } from 'react-native-svg';
import { SegmentedArcContext } from '../SegmentedArc';
import { drawArc } from '../utils/arcHelpers';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Segment = ({ arc, changeFilledArcColor }) => {
  const segmentedArcContext = useContext(SegmentedArcContext);
  const {
    filledArcWidth,
    filledArcColor,
    emptyArcColor,
    incompleteArcColor,
    radius,
    isAnimated,
    emptyArcWidth,
    arcAnimatedValue
  } = segmentedArcContext;

  const arcRef = useRef();
  const animationComplete = useRef(false);

  const _getArcColor = () => {
    if (changeFilledArcColor) {
      return arc.color;
    }

    if (arc.isComplete) {
      return filledArcColor;
    }

    return incompleteArcColor || filledArcColor;
  };

  useEffect(() => {
    if (!isAnimated) return;
    const listener = arcAnimatedValue.addListener(v => {
      if (!arcRef.current) return;
      if (animationComplete.current) return;
      if (v.value <= arc.start) return;

      if (v.value >= arc.end) {
        arcRef.current.setNativeProps({
          d: drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.end)
        });
        animationComplete.current = true;
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
        stroke={changeFilledArcColor ? arc.color : emptyArcColor}
        strokeWidth={emptyArcWidth}
        d={drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.end)}
      />

      {isAnimated && arc.filled > arc.start && (
        <AnimatedPath ref={arcRef} fill="none" stroke={_getArcColor()} strokeWidth={filledArcWidth} />
      )}

      {!isAnimated && arc.filled > arc.start && (
        <Path
          fill="none"
          stroke={_getArcColor()}
          strokeWidth={filledArcWidth}
          d={drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.filled)}
        />
      )}
    </G>
  );
};

export default Segment;

Segment.propTypes = {
  arc: PropTypes.object,
  changeFilledArcColor: PropTypes.bool
};
