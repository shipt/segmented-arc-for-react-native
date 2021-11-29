import React from 'react';
import { Text, Animated, Easing } from 'react-native';
import { SegmentedArc } from '../SegmentedArc';
import { render } from '@testing-library/react-native';

describe('SegmentedArc', () => {
  let segments = [
    {
      scale: 0.25,
      color: '#FF0000',
      label: 'First Segment'
    },
    {
      scale: 0.02,
      color: '#FFA500',
      label: 'Second Segment'
    },
    {
      scale: 0.02,
      color: '#00FF00',
      label: 'Third Segment'
    },
    {
      scale: 0.02,
      color: '#0000FF',
      label: 'Fourth Segment'
    }
  ];

  const testId = 'container';
  let props = {};
  let wrapper;

  const getWrapper = properties => {
    return render(<SegmentedArc {...properties} />);
  };

  beforeEach(() => {
    Animated.timing = jest.fn();
    Easing.out = jest.fn();
    Easing.ease = jest.fn();
    Animated.timing.mockReturnValue({ start: jest.fn() });
    props = { segments, fillValue: 50 };
  });

  afterEach(() => {
    Animated.timing.mockReset();
    Easing.out.mockReset();
    Easing.ease.mockReset();
  });

  it('renders default', () => {
    wrapper = getWrapper(props);
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
    expect(Animated.timing).toHaveBeenCalledTimes(1);
    expect(Easing.out).toHaveBeenCalledWith(Easing.ease);
  });

  it('does not render the component when segments is not provided', () => {
    wrapper = getWrapper({ ...props, segments: [] });
    expect(wrapper.queryByTestId(testId)).toBeNull();
  });

  it("automatically increases the component's height when totalArcSize is greater than 180 degrees", () => {
    wrapper = getWrapper({ ...props, totalArcSize: 270 });
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
  });

  it('renders arc with ranges', () => {
    props.showArcRanges = true;
    props.ranges = ['1.25', '2.5', '3.75', '5'];
    wrapper = getWrapper(props);
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot('shows ranges');
  });

  it('renders with middle content', () => {
    wrapper = render(
      <SegmentedArc {...props}>{lastFilledSegment => <Text>{lastFilledSegment.label}</Text>}</SegmentedArc>
    );
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
  });

  it('does not define animation', () => {
    props.isAnimated = false;
    wrapper = getWrapper(props);
    expect(Animated.timing).not.toHaveBeenCalled();
    expect(Easing.out).not.toHaveBeenCalledWith(Easing.ease);
  });

  it('sets the last segment for lastFilledSegment prop when fillValue is equal or greater than 100%', () => {
    props.fillValue = 100;
    wrapper = getWrapper(props);
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
  });
});
