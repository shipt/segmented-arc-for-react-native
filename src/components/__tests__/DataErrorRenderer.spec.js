import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { DATA_ERROR_SELECTORS } from '../../utils/dataErrorSelectors';
import DataErrorRenderer from '../DataErrorRenderer';

describe('DataErrorRenderer', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(); // ignore some intentional invalid prop type errors
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a fallback DataError component when no dataErrorComponent is passed', () => {
    const wrapper = render(<DataErrorRenderer dataErrorComponent={undefined} />);
    expect(wrapper.getByTestId(DATA_ERROR_SELECTORS.CONTAINER)).toBeOnTheScreen();
  });

  it('renders the provided component when dataErrorComponent is a valid React element', () => {
    const TestComponent = () => <Text>Test Functional Component</Text>;
    const wrapper = render(<DataErrorRenderer dataErrorComponent={TestComponent} />);
    expect(wrapper.getByText('Test Functional Component')).toBeOnTheScreen();
  });

  it('renders the provided class component when dataErrorComponent is a valid React class component', () => {
    class TestClassComponent extends React.Component {
      render() {
        return <Text>Test Class Component</Text>;
      }
    }

    const wrapper = render(<DataErrorRenderer dataErrorComponent={TestClassComponent} />);
    expect(wrapper.getByText('Test Class Component')).toBeOnTheScreen();
  });

  it('does not render any component when dataErrorComponent is null', () => {
    const { root } = render(<DataErrorRenderer dataErrorComponent={null} />);
    expect(root).toBeUndefined();
  });

  it('does not render any component when dataErrorComponent false', () => {
    const { root } = render(<DataErrorRenderer dataErrorComponent={false} />);
    expect(root).toBeUndefined();
  });

  it('renders a fallback DataError component when dataErrorComponent is an invalid type (number)', () => {
    const wrapper = render(<DataErrorRenderer dataErrorComponent={42} />);
    expect(wrapper.getByTestId(DATA_ERROR_SELECTORS.CONTAINER)).toBeOnTheScreen();
  });

  it('renders a fallback DataError component when dataErrorComponent is an invalid type (array)', () => {
    const wrapper = render(<DataErrorRenderer dataErrorComponent={['some', 'array']} />);
    expect(wrapper.getByTestId(DATA_ERROR_SELECTORS.CONTAINER)).toBeOnTheScreen();
  });

  it('renders a fallback DataError component when dataErrorComponent is an invalid type (object)', () => {
    const wrapper = render(<DataErrorRenderer dataErrorComponent={{ key: 'value' }} />);
    expect(wrapper.getByTestId(DATA_ERROR_SELECTORS.CONTAINER)).toBeOnTheScreen();
  });
});
