import React from 'react';
import { Segment } from '../Segment';
import { SegmentedArcContext } from '../../SegmentedArc';
import { render } from '@testing-library/react-native';

describe('Segment', () => {
  let props = {};

  let wrapper;
  let contextValue = {};

  const getWrapper = properties => {
    return render(
      <SegmentedArcContext.Provider value={contextValue}>
        <Segment {...properties} />
      </SegmentedArcContext.Provider>
    );
  };

  beforeEach(() => {
    contextValue = {
      emptyArcWidth: 2,
      totalArcs: 4,
      radius: 100,
      animationDuration: 1000,
      filledArcWidth: 12,
      isAnimated: false,
      arcAnimatedValue: { addListener: jest.fn() }
    };

    props = {
      arc: {
        centerX: 120,
        centerY: 120,
        end: 225,
        filled: 225,
        isComplete: true,
        label: 'Fourth Segment',
        start: 159,
        filledColor: 'blue',
        emptyColor: 'red'
      }
    };

    wrapper = getWrapper(props);
  });

  afterEach(() => {
    contextValue.arcAnimatedValue.addListener.mockRestore();
  });

  it('renders default', () => {
    expect(wrapper).toMatchSnapshot();
    expect(contextValue.arcAnimatedValue.addListener).not.toHaveBeenCalled();
  });

  it('renders green when segment is incomplete and incompleteColor is provided', () => {
    props.arc.isComplete = false;
    props.filled = 220;
    props.arc.incompleteColor = 'green';
    wrapper = getWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('animates segments', () => {
    contextValue.isAnimated = true;
    contextValue.wrapper = getWrapper(props);
    expect(contextValue.arcAnimatedValue.addListener).toHaveBeenCalledTimes(1);
  });
});
