import React from 'react';
import { Text, Animated, Easing } from 'react-native';
import { SegmentedArc } from '../SegmentedArc';
import { render } from '@testing-library/react-native';
import { createInvalidScaleValueError } from '../utils/segmentedArcWarnings';
import { DATA_ERROR_SELECTORS } from '../utils/dataErrorSelectors';
import { createParsedNaNError } from '../utils/numberTransformer';

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
    jest.clearAllMocks();
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

  describe('SegmentedArc onDataError behavior', () => {
    it('does calls onDataError callback with no errors', () => {
      const onDataError = jest.fn();
      wrapper = getWrapper({ ...props, onDataError });
      expect(onDataError).not.toHaveBeenCalled();
    });

    it('calls onDataError once on initial render when segments contain invalid data', () => {
      const invalidSegment = { ...props.segments[0], scale: NaN };
      const segmentsWithInvalidData = [...props.segments, invalidSegment];
      const onDataError = jest.fn();

      render(<SegmentedArc {...props} segments={segmentsWithInvalidData} onDataError={onDataError} />);

      expect(onDataError).toHaveBeenCalledTimes(1);
      expect(onDataError).toHaveBeenCalledWith({ segments: [invalidSegment] });
    });

    it('does not call onDataError when only the callback reference changes', () => {
      const invalidSegment = { ...props.segments[0], scale: NaN };
      const segmentsWithInvalidData = [...props.segments, invalidSegment];
      const initialOnDataError = jest.fn();
      const newOnDataError = jest.fn();

      const wrapper = render(
        <SegmentedArc {...props} segments={segmentsWithInvalidData} onDataError={initialOnDataError} />
      );

      wrapper.rerender(<SegmentedArc {...props} segments={segmentsWithInvalidData} onDataError={newOnDataError} />);

      expect(newOnDataError).not.toHaveBeenCalled();
    });

    it('calls onDataError when invalid segments change', () => {
      const onDataError = jest.fn();
      const invalidSegmentWithNaN = { ...props.segments[0], scale: NaN };
      const segmentsWithInvalidData = [...props.segments, invalidSegmentWithNaN];
      const wrapper = render(<SegmentedArc {...props} segments={segmentsWithInvalidData} onDataError={onDataError} />);
      expect(onDataError).toHaveBeenCalledTimes(1);
      expect(onDataError).toHaveBeenCalledWith({ segments: [invalidSegmentWithNaN] });

      const invalidSegmentWithNull = { ...props.segments[0], scale: null };
      const newSegments = [...props.segments, invalidSegmentWithNull];
      onDataError.mockReset();
      wrapper.rerender(<SegmentedArc {...props} segments={newSegments} onDataError={onDataError} />);
      expect(onDataError).toHaveBeenCalledTimes(1);
      expect(onDataError).toHaveBeenCalledWith({ segments: [invalidSegmentWithNull] });
    });

    it('does not call onDataError when segments become valid', () => {
      const invalidSegmentWithNaN = { ...props.segments[0], scale: NaN };
      const segmentsWithInvalidData = [...props.segments, invalidSegmentWithNaN];
      const onDataError = jest.fn();

      const wrapper = render(<SegmentedArc {...props} segments={segmentsWithInvalidData} onDataError={onDataError} />);

      onDataError.mockReset();
      wrapper.rerender(<SegmentedArc {...props} segments={props.segments} onDataError={onDataError} />);

      expect(onDataError).not.toHaveBeenCalled();
    });

    it('calls the onDataError always with the latest callback', () => {
      const onDataError = jest.fn();
      const wrapper = render(<SegmentedArc {...props} onDataError={onDataError} />);

      const invalidSegment = { ...props.segments[0], scale: NaN };
      const segmentsWithInvalidData = [...props.segments, invalidSegment];
      const latestOnDataError = jest.fn();
      const updatedProperties = { ...props, segments: segmentsWithInvalidData, onDataError: latestOnDataError };
      wrapper.rerender(<SegmentedArc {...updatedProperties} />);
      expect(onDataError).not.toHaveBeenCalled();
      expect(latestOnDataError).toHaveBeenCalledTimes(1);
      expect(latestOnDataError).toHaveBeenCalledWith({ segments: [invalidSegment] });
    });
  });

  it('does not warn about invalid segment scale in production', () => {
    const currentGlobalDev = global.__DEV__;
    global.__DEV__ = false;

    getWrapper({ ...props, segments: [{ ...props.segments[0], scale: NaN }] });

    expect(console.warn).not.toHaveBeenCalled();
    global.__DEV__ = currentGlobalDev;
  });

  it(`does not generate a warning if optional props are not passed to the component.`, () => {
    wrapper = getWrapper({ segments });

    expect(console.warn).not.toHaveBeenCalled();
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

  describe('when the component has an invalid number props', () => {
    [
      { propertyName: 'fillValue', value: NaN, expectedDefaultValue: 0 },
      { propertyName: 'filledArcWidth', value: NaN, expectedDefaultValue: 8 },
      { propertyName: 'emptyArcWidth', value: NaN, expectedDefaultValue: 8 },
      { propertyName: 'spaceBetweenSegments', value: NaN, expectedDefaultValue: 2 },
      { propertyName: 'arcDegree', value: NaN, expectedDefaultValue: 180 },
      { propertyName: 'radius', value: NaN, expectedDefaultValue: 100 }
    ].forEach(({ propertyName, value, expectedDefaultValue }) => {
      describe(`with the property name ${propertyName} and the value ${value}`, () => {
        it(`warns about NaN and converts to the defaultValue ${expectedDefaultValue}`, () => {
          wrapper = getWrapper({ ...props, [propertyName]: value });

          expect(console.warn).toHaveBeenCalledWith(
            createParsedNaNError(value, { propertyName, defaultValue: expectedDefaultValue })
          );
        });
      });
    });
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
