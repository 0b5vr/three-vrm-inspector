import { InspectorContext } from '../InspectorContext';
import { useContext, useEffect, useMemo, useState } from 'react';

export const ProgressBar = (): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const [ progress, setProgress ] = useState<ProgressEvent | null>( null );

  useEffect( () => {
    const handleLoad = (): void => {
      setProgress( null );
    };

    const handleProgress = ( p: ProgressEvent ): void => {
      setProgress( p );
    };

    inspector.on( 'load', handleLoad );
    inspector.on( 'progress', handleProgress );

    return () => {
      inspector.off( 'load', handleLoad );
      inspector.off( 'progress', handleProgress );
    };
  } );

  const progressNormalized = useMemo(
    () => ( progress ? ( progress.loaded / progress.total ) : null ),
    [ progress ]
  );

  return <>
    <div className="w-full h-full absolute text-center pointer-events-none">
      <div>{ progressNormalized ? ( 100.0 * progressNormalized ).toFixed( 2 ) : 'yay' }</div>
    </div>
  </>;
};
