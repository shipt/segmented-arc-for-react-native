/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SegmentedArc } from '@shipt/react-native-segmented-arc';

const App = () => {
  const [showArcRanges, setShowArcRanges] = useState(false);

  const segments = [
    {
      scale: 0.25,
      color: '#FF746E',
      label: 'Red'
    },
    {
      scale: 0.25,
      color: '#F5E478',
      label: 'Yellow'
    },
    {
      scale: 0.25,
      color: '#78F5CA',
      label: 'Green'
    },
    {
      scale: 0.25,
      color: '#6E73FF',
      label: 'Blue'
    }
  ];

  const ranges = ['10', '20', '30', '40', '50'];

  const _handlePress = () => {
    setShowArcRanges(!showArcRanges);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SegmentedArc
        segments={segments}
        fillValue={70}
        isAnimated={true}
        animationDelay={1000}
        showArcRanges={showArcRanges}
        ranges={ranges}
        displaySegmentsColors={showArcRanges}
        coverEmptySegmentsWithColors={false}
      >
        {lastFilledSegment => (
          <Pressable onPress={_handlePress} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, paddingTop: 16 }}>{lastFilledSegment.label}</Text>
            <Text style={{ lineHeight: 80, fontSize: 24 }}>More info</Text>
          </Pressable>
        )}
      </SegmentedArc>
    </View>
  );
};

export default App;
