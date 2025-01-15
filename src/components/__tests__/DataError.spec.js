import { render } from '@testing-library/react-native';
import React from 'react';
import DataError from '../DataError';

describe('DataError', () => {
  it('renders default', () => {
    expect(render(<DataError />)).toMatchSnapshot();
  });
});
