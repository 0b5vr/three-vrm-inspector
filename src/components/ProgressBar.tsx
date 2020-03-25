import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { Metrics } from '../constants/Metrics';
import styled from 'styled-components';

// == styles =======================================================================================
const Div = styled.div`
  margin: 0;
  padding: 0;
`;

const Root = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  font-size: ${ Metrics.rootFontSize };
  color: ${ Colors.fore };
  text-align: center;
  pointer-events: none;
`;


// == element ======================================================================================
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
    <Root>
      <Div>{ progressNormalized ? ( 100.0 * progressNormalized ).toFixed( 2 ) : 'yay' }</Div>
    </Root>
  </>;
};
