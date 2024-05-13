import React, { useState, useEffect, useRef, createContext } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import Segment from './components/Segment';
import Cap from './components/Cap';
import RangesDisplay from './components/RangesDisplay';

const SegmentedArcContext = createContext();

export const SegmentedArc = ({
  fillValue = 0,
  segments = [],
  filledArcWidth = 8,
  emptyArcWidth = 8,
  spaceBetweenSegments = 2,
  arcDegree = 180,
  radius = 100,
  animationDuration = 1000,
  isAnimated = true,
  animationDelay = 0,
  showArcRanges = false,
  middleContentContainerStyle = {},
  ranges = [],
  rangesTextColor = '#000000',
  rangesTextStyle = styles.rangeTextStyle,
  capInnerColor = '#28E037',
  capOuterColor = '#FFFFFF',
  alignRangesWithSegments = true,
  children
}) => {
  const [arcAnimatedValue] = useState(new Animated.Value(0));
  const animationRunning = useRef(false);

  if (segments.length === 0) {
    return null;
  }

  const totalArcs = segments.length;
  const totalSpaces = totalArcs - 1;
  const totalSpacing = totalSpaces * spaceBetweenSegments;

  const arcSegmentDegree = (arcDegree - totalSpacing) / totalArcs;
  const arcsStart = 90 - arcDegree / 2;

  const effectiveRadius = radius + Math.max(filledArcWidth, emptyArcWidth);
  const margin = 12;
  let svgHeight = effectiveRadius + margin * 1.5;
  const svgWidth = effectiveRadius * 2 + 2 * margin;
  const center = effectiveRadius + margin;

  if (arcDegree > 180) {
    const offsetAngle = (arcDegree - 180) / 2;
    const heightOffset = effectiveRadius * Math.sin(offsetAngle);
    svgHeight += heightOffset + 2 * margin + filledArcWidth;
  }

  const localMiddleContentContainerStyle = {
    position: 'absolute',
    alignSelf: 'center',
    top: filledArcWidth + margin + 16,
    width: radius + filledArcWidth * 2,
    height: radius,
    alignItems: 'center',
    overflow: 'hidden',
    ...middleContentContainerStyle
  };

  const _ensureDefaultSegmentScale = () => {
    const segmentsWithoutScale = segments.filter(segment => !segment.scale);
    const allocatedScale = segments.reduce((total, current) => total + (current.scale || 0), 0);
    const defaultArcScale = (1 - allocatedScale) / segmentsWithoutScale.length;
    segmentsWithoutScale.forEach(segment => (segment.scale = defaultArcScale));
  };

  const _ensureDefaultArcScale = () => {
    const segmentsWithoutArcDegreeScaleLength = segments.filter(
      segment => typeof segment.arcDegreeScale !== 'number'
    ).length;
    const totalProvidedArcDegreeScale = segments.reduce((acc, segment) => acc + (segment.arcDegreeScale ?? 0), 0);
    segments.forEach(segment => {
      if (typeof segment.arcDegreeScale !== 'number')
        segment.arcDegreeScale = (1 - totalProvidedArcDegreeScale) / segmentsWithoutArcDegreeScaleLength;
    });
  };

  let remainingValue = fillValue;

  _ensureDefaultSegmentScale();
  _ensureDefaultArcScale();

  let arcs = [];
  segments.forEach((segment, index) => {
    const arcDegreeScale = segment.arcDegreeScale;
    const previousSegmentEnd = !!index ? arcs[index - 1].end : arcsStart;
    const start = previousSegmentEnd + (!!index ? spaceBetweenSegments : 0);
    const end = (arcDegree - totalSpacing) * arcDegreeScale + start;

    const valueMax = 100 * segment.scale;
    const effectiveScaledValue = Math.min(remainingValue, valueMax);
    const scaledPercentage = effectiveScaledValue / valueMax;
    const filled = start + scaledPercentage * (end - start);
    remainingValue -= effectiveScaledValue;

    const newArc = {
      centerX: center,
      centerY: center,
      start,
      end,
      filled,
      isComplete: filled === end,
      filledColor: segment.filledColor,
      emptyColor: segment.emptyColor,
      data: segment.data
    };

    arcs.push(newArc);
  });

  const lastFilledSegment = arcs.find(a => a.filled !== a.end) || arcs[arcs.length - 1];

  useEffect(() => {
    if (!lastFilledSegment) return;
    if (animationRunning.current) return;
    if (!isAnimated) return;
    animationRunning.current = true;
    Animated.timing(arcAnimatedValue, {
      toValue: lastFilledSegment.filled,
      duration: animationDuration,
      delay: animationDelay,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease)
    }).start();

    const listenerId = arcAnimatedValue.addListener(e => {
      if (e.value === lastFilledSegment.filled) animationRunning.current = false;
    });
    return () => arcAnimatedValue.removeListener(listenerId);
  }, []);

  if (arcs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} testID="container">
      <Svg width={svgWidth} height={svgHeight}>
        <SegmentedArcContext.Provider
          value={{
            arcs,
            margin,
            center,
            filledArcWidth,
            radius,
            isAnimated,
            animationDuration,
            emptyArcWidth,
            totalArcs,
            arcsStart,
            spaceBetweenSegments,
            arcSegmentDegree,
            arcAnimatedValue,
            lastFilledSegment,
            ranges,
            rangesTextColor,
            rangesTextStyle,
            capInnerColor,
            capOuterColor,
            alignRangesWithSegments
          }}
        >
          {arcs.map((arc, index) => (
            <Segment key={index.toString()} arc={arc} />
          ))}

          <Cap />

          {showArcRanges && <RangesDisplay />}
        </SegmentedArcContext.Provider>
      </Svg>

      {children && <View style={localMiddleContentContainerStyle}>{children({ lastFilledSegment })}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  rangeTextStyle: {
    fontSize: 12
  }
});

SegmentedArc.propTypes = {
  fillValue: PropTypes.number,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      scale: PropTypes.number,
      filledColor: PropTypes.string.isRequired,
      emptyColor: PropTypes.string.isRequired,
      data: PropTypes.object,
      arcDegreeScale: PropTypes.number
    })
  ).isRequired,
  filledArcWidth: PropTypes.number,
  emptyArcWidth: PropTypes.number,
  spaceBetweenSegments: PropTypes.number,
  arcDegree: PropTypes.number,
  radius: PropTypes.number,
  animationDuration: PropTypes.number,
  isAnimated: PropTypes.bool,
  animationDelay: PropTypes.number,
  showArcRanges: PropTypes.bool,
  children: PropTypes.func,
  middleContentContainerStyle: PropTypes.object,
  ranges: PropTypes.arrayOf(PropTypes.string),
  rangesTextColor: PropTypes.string,
  rangesTextStyle: PropTypes.object,
  capInnerColor: PropTypes.string,
  capOuterColor: PropTypes.string,
  alignRangesWithSegments: PropTypes.bool
};
export { SegmentedArcContext };
export default SegmentedArc;
