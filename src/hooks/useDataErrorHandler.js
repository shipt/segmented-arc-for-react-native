import { useEffect, useState, useRef } from 'react';

export const useDataErrorHandler = (callback, { invalidSegments }) => {
  const [dataError, setDataError] = useState({});
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    setDataError(prevErrors => ({
      ...prevErrors,
      ...(invalidSegments.length ? { segments: invalidSegments } : {})
    }));
  }, [invalidSegments]);

  useEffect(() => {
    if (Object.keys(dataError).length > 0 && callbackRef.current) {
      callbackRef.current(dataError);
    }
  }, [dataError]);

  return dataError;
};
