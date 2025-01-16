import React from 'react';
import { Text, Animated, Easing } from 'react-native';
import { SegmentedArc } from '../SegmentedArc';
import { render } from '@testing-library/react-native';
import { createInvalidScaleValueError } from '../utils/segmentedArcWarnings';
import { DATA_ERROR_SELECTORS } from '../utils/dataErrorSelectors';

describe('SegmentedArc', () => {
  let segments = [
    {
      scale: 0.25,
      filledColor: '#FF0000',
      emptyColor: '#F2F3F5',
      data: { label: 'First Segment' }
    },
    {
      scale: 0.02,
      filledColor: '#FFA500',
      emptyColor: '#F2F3F5',
      data: { label: 'Second Segment' }
    },
    {
      scale: 0.02,
      filledColor: '#00FF00',
      emptyColor: '#F2F3F5',
      data: { label: 'Third Segment' }
    },
    {
      scale: 0.02,
      filledColor: '#0000FF',
      emptyColor: '#F2F3F5',
      data: { label: 'Fourth Segment' }
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
    jest.spyOn(console, 'warn').mockImplementation();
    props = { segments, fillValue: 50 };
  });

  afterEach(() => {
    Animated.timing.mockReset();
    Easing.out.mockReset();
    Easing.ease.mockReset();
    console.warn.mockReset();
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

  it('does not warn about invalid segment scale in production', () => {
    const currentGlobalDev = global.__DEV__;
    global.__DEV__ = false;

    getWrapper({ ...props, segments: [{ ...props.segments[0], scale: NaN }] });

    expect(console.warn).not.toHaveBeenCalled();
    global.__DEV__ = currentGlobalDev;
  });

  it('generates warnings only for the first time the component is rendered, not warning again on rerender with new props(reference or value)', () => {
    const properties = { ...props, segments: [{ ...props.segments[0], scale: NaN }] };
    const wrapper = render(<SegmentedArc {...properties} />);

    const updatedProps = {
      ...properties,
      segments: [
        { ...properties.segments[0], scale: NaN },
        { ...properties.segments[0], arcDegreeScale: NaN }
      ]
    };
    wrapper.rerender(<SegmentedArc {...updatedProps} />);
    const newReferenceProps = structuredClone(properties);
    wrapper.rerender(<SegmentedArc {...newReferenceProps} />);

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('render a data error component when invalid segments are passed', () => {
    const properties = { ...props, segments: [{ ...props.segments[0], scale: NaN }] };
    const wrapper = render(<SegmentedArc {...properties} />);

    expect(wrapper.getByTestId(DATA_ERROR_SELECTORS.CONTAINER)).toBeOnTheScreen();
  });

  it('does not render a data error component when valid segments are passed', () => {
    const wrapper = render(<SegmentedArc {...props} />);

    expect(wrapper.queryByTestId(DATA_ERROR_SELECTORS.CONTAINER)).not.toBeOnTheScreen();
  });

  it('shows warnings and renders the component when segments have invalid scale or arcDegreeScale data', () => {
    wrapper = getWrapper({
      ...props,
      segments: [
        { arcDegreeScale: NaN, emptyColor: '#F3F3F4', filledColor: '#502D91' },
        { scale: NaN, emptyColor: '#F3F3F4', filledColor: '#177CBA' },
        { emptyColor: '#F3F3F4', filledColor: '#CF5625' }
      ]
    });
    expect(console.warn).toHaveBeenCalledWith(createInvalidScaleValueError('scale', NaN));
    expect(console.warn).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', NaN));
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
  });

  it("automatically increases the component's height when arcDegree is greater than 180 degrees", () => {
    wrapper = getWrapper({ ...props, arcDegree: 270 });
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

  it('renders segments with arc degree scales', () => {
    const segments = [
      {
        scale: 0.25,
        arcDegreeScale: 0.5,
        filledColor: '#FF0000',
        emptyColor: '#F2F3F5',
        data: { label: 'First Segment' }
      },
      {
        scale: 0.02,
        arcDegreeScale: 0.3,
        filledColor: '#FFA500',
        emptyColor: '#F2F3F5',
        data: { label: 'Second Segment' }
      },
      {
        scale: 0.02,
        arcDegreeScale: 0.2,
        filledColor: '#FFA500',
        emptyColor: '#F2F3F5',
        data: { label: 'Third Segment' }
      }
    ];
    wrapper = getWrapper({ ...props, segments });
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
    expect(Animated.timing).toHaveBeenCalledTimes(1);
    expect(Easing.out).toHaveBeenCalledWith(Easing.ease);
  });

  it('renders with ensured arc degree scales when missing from segments', () => {
    const segments = [
      {
        scale: 0.25,
        arcDegreeScale: 0.5,
        filledColor: '#FF0000',
        emptyColor: '#F2F3F5',
        data: { label: 'First Segment' }
      },
      {
        scale: 0.02,
        filledColor: '#FFA500',
        emptyColor: '#F2F3F5',
        data: { label: 'Second Segment' }
      },
      {
        scale: 0.02,
        filledColor: '#FFA500',
        emptyColor: '#F2F3F5',
        data: { label: 'Third Segment' }
      }
    ];
    wrapper = getWrapper({ ...props, segments });
    expect(wrapper.getByTestId(testId).props).toMatchSnapshot();
    expect(Animated.timing).toHaveBeenCalledTimes(1);
    expect(Easing.out).toHaveBeenCalledWith(Easing.ease);
  });
});
