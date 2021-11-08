import React, { useContext, useMemo } from 'react';
import { G, Path, Defs, TextPath, Text } from 'react-native-svg';
import { SegmentedArcContext } from '../SegmentedArc';
import { drawArc } from '../utils/arcHelpers';

export const RangesDisplay = () => {
  const segmentedArcContext = useContext(SegmentedArcContext);
  const { radius, filledArcWidth, margin, arcsStart, arcSpacing, arcSize, ranges, rangesTextColor, rangesTextStyle } =
    segmentedArcContext;

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
    const end = arcsStart + index * (arcSize + arcSpacing);
    const start = arcSize + end;

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
      <Defs>{mappedPathKeys.map(_getRangesPath)}</Defs>
      {mappedPathKeys.map(_getRangesDisplayValue)}
    </G>
  );
};

export default RangesDisplay;
