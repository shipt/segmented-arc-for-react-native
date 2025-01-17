import React from 'react';
import PropTypes from 'prop-types';
import DataError from './DataError';
import { DATA_ERROR_SELECTORS } from '../utils/dataErrorSelectors';

const DataErrorRenderer = ({ dataErrorComponent, style }) => {
  if (dataErrorComponent === null || dataErrorComponent === false) return null;

  if (typeof dataErrorComponent === 'function') {
    return React.createElement(dataErrorComponent);
  }

  if (React.isValidElement(dataErrorComponent)) {
    return dataErrorComponent;
  }

  return <DataError style={style} testID={DATA_ERROR_SELECTORS.CONTAINER} />;
};

DataErrorRenderer.propTypes = {
  dataErrorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.elementType]),
  style: PropTypes.object
};

export default DataErrorRenderer;
