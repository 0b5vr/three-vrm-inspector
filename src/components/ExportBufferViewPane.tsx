import { Pane, PaneParams } from './Pane';
import React, { useCallback, useContext, useRef } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const InputNumber = styled.input`
  width: 6em;
`;

const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == element ======================================================================================
export const ExportBufferViewPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const refInput = useRef<HTMLInputElement | null>( null );

  const handleSubmit = useCallback( ( event: React.FormEvent ) => {
    event.preventDefault();

    const strIndex = refInput.current?.value;
    if ( strIndex != null && strIndex !== '' ) {
      const index = parseInt( strIndex, 10 );
      inspector.exportBufferView( index );
    }
  }, [ inspector ] );


  return (
    <Pane { ...params }>
      <Root>
        <form onSubmit={ handleSubmit }>
          <InputNumber type="number" ref={ refInput } defaultValue={ 0 } required />
          <input type="submit" value="Export" />
        </form>
      </Root>
    </Pane>
  );
};
