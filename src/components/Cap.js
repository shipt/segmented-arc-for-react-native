import React, { useEffect, useRef, useContext } from 'react';
import { Animated } from 'react-native';
import { G, Circle } from 'react-native-svg';
import { SegmentedArcContext } from '../SegmentedArc';
import { polarToCartesian } from '../utils/arcHelpers';

const AnimatedArcCap = Animated.createAnimatedComponent(Circle);

export const Cap = () => {
  const segmentedArcContext = useContext(SegmentedArcContext);
  const { isAnimated, center, radius, arcsStart, arcAnimatedValue, lastFilledSegment, capInnerColor, capOuterColor } =
    segmentedArcContext;

  const outerCircleRef = useRef();
  const innerCircleRef = useRef();

  const angle = lastFilledSegment.filled;

  const _getCapCoordinates = endAngle => {
    const pos = polarToCartesian(center, center, radius, endAngle);
    return { cx: pos.x, cy: pos.y };
  };

  useEffect(() => {
    if (!isAnimated) return;
    const listener = arcAnimatedValue.addListener(v => {
      if (!innerCircleRef.current || !outerCircleRef.current) return;

      const coordinates = _getCapCoordinates(v.value);
      outerCircleRef.current.setNativeProps({
        ...coordinates
      });
      innerCircleRef.current.setNativeProps({
        ...coordinates
      });
    });

    return () => arcAnimatedValue.removeListener(listener);
  }, []);

  const initialCoordinates = isAnimated ? _getCapCoordinates(arcsStart) : _getCapCoordinates(angle);
  const ArcCap = isAnimated ? AnimatedArcCap : Circle;

  return (
    <G>
      <ArcCap r="10" fill={capOuterColor} ref={outerCircleRef} {...initialCoordinates} />
      <ArcCap r="6" fill={capInnerColor} ref={innerCircleRef} {...initialCoordinates} />
    </G>
  );
};

export default Cap;
