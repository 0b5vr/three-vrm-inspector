import { Pane, PaneParams } from './Pane';
import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { MaterialDebuggerMode } from '../inspector/MaterialDebugger';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

const Select = styled.select`
  width: 100%;
`;

// == element ======================================================================================
export const MaterialDebuggerPane = ( params: PaneParams ): JSX.Element => {
  const { materialDebugger } = useContext( InspectorContext );

  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const mode = parseInt( event.target.value ) as MaterialDebuggerMode;

      materialDebugger.applyMode( mode );
    },
    [ materialDebugger ]
  );

  return (
    <Pane { ...params }>
      <Root>
        <Select onChange={handleSelectChange}>
          <option value={ MaterialDebuggerMode.None }>None</option>
          <option value={ MaterialDebuggerMode.MToonNormal }>MToon Normal</option>
          <option value={ MaterialDebuggerMode.MToonLitShadeRate }>MToon LitShadeRate</option>
          <option value={ MaterialDebuggerMode.MToonUV }>MToon UV</option>
          <option value={ MaterialDebuggerMode.UVGrid }>UV Grid</option>
        </Select>
      </Root>
    </Pane>
  );
};
