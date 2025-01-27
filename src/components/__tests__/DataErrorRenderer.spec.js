import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { DATA_ERROR_SELECTORS } from '../../utils/dataErrorSelectors';
import DataErrorRenderer, { createInvalidDataErrorComponentError } from '../DataErrorRenderer';

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

  it('allows custom style for DataError', () => {
    const style = { width: 400 };
    const wrapper = render(<DataErrorRenderer style={style} />);
    expect(wrapper.getByTestId(DATA_ERROR_SELECTORS.CONTAINER)).toHaveStyle(style);
  });

  it('renders the provided component when dataErrorComponent is a valid React element', () => {
    const JSXElement = <Text>Test JSX Element Component</Text>;
    const wrapper = render(<DataErrorRenderer dataErrorComponent={JSXElement} />);
    expect(wrapper.getByText('Test JSX Element Component')).toBeOnTheScreen();
  });

  it('renders the provided class component when dataErrorComponent is a valid React class component', () => {
    class TestClassComponent extends React.Component {
      render() {
        return <Text>Test Class Component</Text>;
      }
    }

    const wrapper = render(<DataErrorRenderer dataErrorComponent={<TestClassComponent />} />);
    expect(wrapper.getByText('Test Class Component')).toBeOnTheScreen();
  });

  it('does not render any component when dataErrorComponent is null', () => {
    const { root } = render(<DataErrorRenderer dataErrorComponent={null} />);
    expect(root).toBeUndefined();
  });

  describe('DataErrorRenderer unexpected types', () => {
    const testInvalidDataErrorComponent = dataErrorComponent => {
      expect(() => render(<DataErrorRenderer dataErrorComponent={dataErrorComponent} />)).toThrow(
        createInvalidDataErrorComponentError()
      );
    };

    it("throws an error when 'dataErrorComponent' is passed as an unexpected functional component", () => {
      const UnexpectedFunctionalComponent = () => <Text>Test Functional Component</Text>;
      testInvalidDataErrorComponent(UnexpectedFunctionalComponent);
    });

    it("throws an error when 'dataErrorComponent' is passed as a boolean", () => {
      const invalidBooleanComponent = false;
      testInvalidDataErrorComponent(invalidBooleanComponent);
    });

    it("throws an error when 'dataErrorComponent' is passed as an array", () => {
      const invalidArrayComponent = ['some', 'array'];
      testInvalidDataErrorComponent(invalidArrayComponent);
    });

    it("throws an error when 'dataErrorComponent' is passed as an object", () => {
      const invalidObjectComponent = { key: 'value' };
      testInvalidDataErrorComponent(invalidObjectComponent);
    });

    it("throws an error when 'dataErrorComponent' is passed as a number", () => {
      const invalidNumberComponent = 42;
      testInvalidDataErrorComponent(invalidNumberComponent);
    });

    it("throws an error when 'dataErrorComponent' is passed as a string", () => {
      const invalidStringComponent = 'any string';
      testInvalidDataErrorComponent(invalidStringComponent);
    });
  });
});
