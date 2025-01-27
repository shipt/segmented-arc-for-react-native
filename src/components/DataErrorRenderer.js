import React from 'react';
import PropTypes from 'prop-types';
import DataError from './DataError';
import { DATA_ERROR_SELECTORS } from '../utils/dataErrorSelectors';
import { SegmentedArcError } from '../utils/segmentedArcErrors';

export const createInvalidDataErrorComponentError = () => {
  return new SegmentedArcError(`'dataErrorComponent' should be a valid JSX element or null.`);
};

const DataErrorRenderer = ({ dataErrorComponent, style }) => {
  if (dataErrorComponent === null) return null;

  if (dataErrorComponent === undefined) {
    return <DataError style={style} testID={DATA_ERROR_SELECTORS.CONTAINER} />;
  }

  if (React.isValidElement(dataErrorComponent)) {
    return dataErrorComponent;
  }

  throw createInvalidDataErrorComponentError();
};

DataErrorRenderer.propTypes = {
  dataErrorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.elementType]),
  style: PropTypes.object
};

export default DataErrorRenderer;
