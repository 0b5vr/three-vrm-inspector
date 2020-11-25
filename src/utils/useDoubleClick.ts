import { useCallback, useRef } from 'react';

export function useDoubleClick(): ( callback: () => void ) => void {
  const refLastClick = useRef( -Infinity );

  const func = useCallback(
    ( callback: () => void ) => {
      const now = performance.now();

      if ( now - refLastClick.current < 250 ) {
        callback();
        refLastClick.current = -Infinity;
      } else {
        refLastClick.current = now;
      }
    },
    [ refLastClick ]
  );

  return func;
}
