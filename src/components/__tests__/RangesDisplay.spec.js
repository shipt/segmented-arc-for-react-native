import React from 'react';
import { RangesDisplay } from '../RangesDisplay';
import { SegmentedArcContext } from '../../SegmentedArc';
import { render } from '@testing-library/react-native';

describe('RangesDisplay', () => {
  let props = {};

  let wrapper;
  let contextValue = {};

  const getWrapper = properties => {
    return render(
      <SegmentedArcContext.Provider value={contextValue}>
        <RangesDisplay {...properties} />
      </SegmentedArcContext.Provider>
    );
  };

  beforeEach(() => {
    contextValue = {
      arcsStart: 0,
      arcSegmentDegree: 180,
      radius: 100,
      filledArcWidth: 10,
      spaceBetweenSegments: 10,
      margin: 40,
      ranges: ['1.25', '2.5', '3.75', '5'],
      rangesTextColor: '#000',
      arcs: [
        { start: 50, end: 0 },
        { start: 100, end: 50 },
        { start: 150, end: 100 }
      ]
    };
    props = {};

    wrapper = getWrapper(props);
  });

  it('renders default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with aligned segments', () => {
    contextValue.alignRangesWithSegments = true;

    getWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });
});
