import React from 'react';
import PropTypes from 'prop-types';
import DataError from './DataError';
import { DATA_ERROR_SELECTORS } from '../utils/dataErrorSelectors';

const DataErrorRenderer = ({ dataErrorComponent, style }) => {
  if (dataErrorComponent === undefined) {
    return <DataError style={style} testID={DATA_ERROR_SELECTORS.CONTAINER} />;
  }

  if (React.isValidElement(dataErrorComponent)) {
    return dataErrorComponent;
  }

  return null;
};

DataErrorRenderer.propTypes = {
  dataErrorComponent: PropTypes.elementType,
  style: PropTypes.object
};

export default DataErrorRenderer;
