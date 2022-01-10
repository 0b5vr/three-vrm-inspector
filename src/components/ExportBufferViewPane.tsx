import { Pane, PaneParams } from './Pane';
import React, { useCallback, useContext, useRef } from 'react';
import { InspectorContext } from '../InspectorContext';
import { PaneRoot } from './PaneRoot';

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
      <PaneRoot>
        <form onSubmit={ handleSubmit } >
          <input type="number" ref={ refInput } defaultValue={ 0 } className="w-24 px-1 bg-gray-800 border border-gray-500" required />
          <input type="submit" className="ml-1 px-1 bg-gray-800 border border-gray-500" value="Export" />
        </form>
      </PaneRoot>
    </Pane>
  );
};
