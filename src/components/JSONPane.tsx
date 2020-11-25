import { Pane, PaneParams } from './Pane';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { JSONValue } from './JSONValue';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  margin: 0;
  padding: 0;
  width: 480px;
  height: 320px;
  overflow: scroll;
  white-space: nowrap;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
  pointer-events: auto;
  resize: both;
`;

// == element ======================================================================================
const JSONPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
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

  return (
    <Pane { ...params }>
      <Root>
        <JSONValue value={ root } />
      </Root>
    </Pane>
  );
};

export { JSONPane };
