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
      arcSize: 180,
      radius: 100,
      filledArcWidth: 10,
      arcSpacing: 10,
      margin: 40,
      ranges: ['1.25', '2.5', '3.75', '5'],
      rangesTextColor: '#000'
    };
    props = {};

    wrapper = getWrapper(props);
  });

  it('renders default', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
