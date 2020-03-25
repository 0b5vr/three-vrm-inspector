import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { MaterialDebuggerMode } from '../inspector/MaterialDebugger';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  margin: 0;
  padding: 0;
  background: ${ Colors.uiBackground };
  pointer-events: auto;
`;

const Select = styled.select`
`;

// == element ======================================================================================
export const MaterialDebuggerOption = (): JSX.Element => {
  const { materialDebugger } = useContext( InspectorContext );

  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const mode = parseInt( event.target.value ) as MaterialDebuggerMode;

      materialDebugger.applyMode( mode );
    },
    [ materialDebugger ]
  );

  return (
    <Root>
      <Select onChange={handleSelectChange}>
        <option value={ MaterialDebuggerMode.None }>None</option>
        <option value={ MaterialDebuggerMode.MToonNormal }>MToon Normal</option>
        <option value={ MaterialDebuggerMode.MToonLitShadeRate }>MToon LitShadeRate</option>
        <option value={ MaterialDebuggerMode.MToonUV }>MToon UV</option>
      </Select>
    </Root>
  );
};
