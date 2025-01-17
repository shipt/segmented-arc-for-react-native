import { render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import DataError from '../DataError';

describe('DataError', () => {
  it('renders default', () => {
    expect(render(<DataError />)).toMatchSnapshot();
  });

  it('renders with custom style', () => {
    const style = StyleSheet.create({ width: 200 });
    const wrapper = render(<DataError style={style} testID="data-error" />);
    expect(wrapper.getByTestId('data-error')).toHaveStyle(style);
  });
});
