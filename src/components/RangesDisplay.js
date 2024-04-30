import React, { useContext, useMemo } from 'react';
import { G, Path, Defs, TextPath, Text } from 'react-native-svg';
import { SegmentedArcContext } from '../SegmentedArc';
import { drawArc } from '../utils/arcHelpers';

export const RangesDisplay = () => {
  const segmentedArcContext = useContext(SegmentedArcContext);
  const {
    radius,
    filledArcWidth,
    margin,
    ranges,
    rangesTextColor,
    rangesTextStyle,
    spaceBetweenSegments,
    arcs,
    arcsStart,
    arcSegmentDegree,
    alignRangesWithSegments
  } = segmentedArcContext;

  const { mappedPathKeys, rangesStartOffset } = useMemo(() => {
    return {
      mappedPathKeys: ranges.map((item, key) => `TextPath-${item}-${key}`),
      rangesStartOffset: ranges.map((_item, index) => `${index !== ranges.length - 1 ? 0 : 100}%`)
    };
  }, [ranges]);

  const _getRangesPath = (id, index) => {
    const rangeRadius = radius + filledArcWidth;
    const centerX = rangeRadius + margin;
    const centerY = rangeRadius + margin;
    const end = arcsStart + index * (arcSegmentDegree + spaceBetweenSegments);
    const start = arcSegmentDegree + end;

    return <Path key={id} id={id} d={drawArc(centerX, centerY, rangeRadius, start, end, true)} />;
  };

  const _getAlignedRangesPath = (id, index) => {
    const rangeRadius = radius + filledArcWidth;
    const centerX = rangeRadius + margin;
    const centerY = rangeRadius + margin;

    const arc = arcs[index];
    const previousArc = arcs[index - 1];

    let end = 0;
    if (previousArc) end = previousArc.end + spaceBetweenSegments;

    let start = end;
    if (arc) start = arc.end;

    return <Path key={id} id={id} d={drawArc(centerX, centerY, rangeRadius, start, end, true)} />;
  };

  const _getRangesDisplayValue = (key, index) => {
    let isLastRange = index === ranges.length - 1;
    let pathId = key;
    if (isLastRange) pathId = mappedPathKeys[index - 1];

    return (
      <Text key={key} fill={rangesTextColor} style={rangesTextStyle} textAnchor={isLastRange ? 'end' : 'start'}>
        <TextPath href={`#${pathId}`} startOffset={rangesStartOffset[index]}>
          {ranges[index]}
        </TextPath>
      </Text>
    );
  };
  return (
    <G>
      <Defs>{mappedPathKeys.map(alignRangesWithSegments ? _getAlignedRangesPath : _getRangesPath)}</Defs>
      {mappedPathKeys.map(_getRangesDisplayValue)}
    </G>
  );
};

export default RangesDisplay;
