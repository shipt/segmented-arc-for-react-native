import React from 'react';
import { Cap } from '../Cap';
import { SegmentedArcContext } from '../../SegmentedArc';
import { render } from '@testing-library/react-native';

describe('Cap', () => {
  let props = {};

  let wrapper;
  let contextValue = {};

  const getWrapper = properties => {
    return render(
      <SegmentedArcContext.Provider value={contextValue}>
        <Cap {...properties} />
      </SegmentedArcContext.Provider>
    );
  };

  beforeEach(() => {
    contextValue = {
      isAnimated: false,
      arcsStart: 0,
      radius: 100,
      center: 10,
      lastFilledSegment: {
        centerX: 120,
        centerY: 120,
        color: '#0000FF',
        end: 225,
        filled: 225,
        isComplete: true,
        data: { label: 'Fourth Segment' },
        start: 159
      },
      arcAnimatedValue: { addListener: jest.fn() }
    };

    wrapper = getWrapper(props);
  });

  it('renders default', () => {
    expect(wrapper).toMatchSnapshot();
    expect(contextValue.arcAnimatedValue.addListener).not.toHaveBeenCalled();
  });

  it('animates the cap', () => {
    contextValue.isAnimated = true;
    wrapper = getWrapper(props);
    expect(contextValue.arcAnimatedValue.addListener).toHaveBeenCalledTimes(1);
  });
});
