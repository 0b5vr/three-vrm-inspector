import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { JSONValue } from './JSONValue';
import { Metrics } from '../constants/Metrics';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
  width: ${ Metrics.jsonTreeWidth };
  height: 100%;
  overflow: scroll;
  white-space: nowrap;
  background: ${ Colors.uiBackground };
  pointer-events: auto;
`;


// == element ======================================================================================
export const JSONTree = (): JSX.Element => {
  const inspector = useContext( InspectorContext );
  const [ root, setRoot ] = useState<any>( undefined );

  useEffect( () => {
    const handleLoad = (): void => {
      setRoot( inspector.gltf!.parser.json );
    };

    inspector.on( 'load', handleLoad );

    return () => {
      inspector.off( 'load', handleLoad );
    };
  }, [ inspector ] );

  return <>
    <Root>
      <JSONValue value={ root } />
    </Root>
  </>;
};
