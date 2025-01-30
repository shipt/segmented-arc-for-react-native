import { useEffect, useState, useRef } from 'react';

export const useDataErrorHandler = (callback, { invalidSegments }) => {
  const [dataError, setDataError] = useState({});
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    setDataError(prevErrors => {
      const { ...errorsWithoutSegments } = prevErrors;
      delete errorsWithoutSegments.segments;
      return invalidSegments.length ? { ...errorsWithoutSegments, segments: invalidSegments } : errorsWithoutSegments;
    });
  }, [invalidSegments]);

  useEffect(() => {
    if (Object.keys(dataError).length > 0 && callbackRef.current) {
      callbackRef.current(dataError);
    }
  }, [dataError]);

  return dataError;
};
