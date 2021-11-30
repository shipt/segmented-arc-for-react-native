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
      emptyArcColor: 'red',
      emptyArcWidth: 2,
      totalArcs: 4,
      radius: 100,
      animationDuration: 1000,
      filledArcWidth: 12,
      isAnimated: false,
      changeFilledArcColor: false,
      filledArcColor: 'blue',
      incompleteArcColor: 'green',
      arcAnimatedValue: { addListener: jest.fn() }
    };

    props = {
      arc: {
        centerX: 120,
        centerY: 120,
        color: '#0000FF',
        end: 225,
        filled: 225,
        isComplete: true,
        label: 'Fourth Segment',
        start: 159
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

  it('renders green as incompleteArcColor', () => {
    props.arc.isComplete = false;
    wrapper = getWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('animates segments', () => {
    contextValue.isAnimated = true;
    contextValue.wrapper = getWrapper(props);
    expect(contextValue.arcAnimatedValue.addListener).toHaveBeenCalledTimes(1);
  });

  it('renders colored segment', () => {
    contextValue.isAnimated = true;
    props.changeFilledArcColor = true;
    wrapper = getWrapper(props);
    expect(wrapper).toMatchSnapshot();
    expect(contextValue.arcAnimatedValue.addListener).toHaveBeenCalledTimes(1);
  });
});
