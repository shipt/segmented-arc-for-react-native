import React from 'react';
import PropTypes from 'prop-types';
import DataError from './DataError';
import { DATA_ERROR_SELECTORS } from '../utils/dataErrorSelectors';

const DataErrorRenderer = ({ dataErrorComponent, style }) => {
  if (dataErrorComponent === null) return null;

  if (React.isValidElement(dataErrorComponent)) {
    return dataErrorComponent;
  }

  return <DataError style={style} testID={DATA_ERROR_SELECTORS.CONTAINER} />;
};

DataErrorRenderer.propTypes = {
  dataErrorComponent: PropTypes.element,
  style: PropTypes.object
};

export default DataErrorRenderer;
