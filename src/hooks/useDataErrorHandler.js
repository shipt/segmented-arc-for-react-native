import { useEffect, useRef } from 'react';

const useDataErrorCallback = (callback, dataErrors) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (callbackRef.current && Object.keys(dataErrors).length > 0) {
      callbackRef.current(dataErrors);
    }
  }, [dataErrors]);
};

export default useDataErrorCallback;
