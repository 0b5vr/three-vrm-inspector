import { DebugMaterialMode, debugMaterial } from '../debugMaterial';
import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
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
export const MaterialDebugger = (): JSX.Element => {
  const inspector = useContext( InspectorContext );

  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const mode = parseInt( event.target.value ) as DebugMaterialMode;
      debugMaterial( inspector, mode );
    },
    [ inspector ]
  );

  return (
    <Root>
      <Select onChange={handleSelectChange}>
        <option value={ DebugMaterialMode.None }>None</option>
        <option value={ DebugMaterialMode.MToonNormal }>MToon Normal</option>
        <option value={ DebugMaterialMode.MToonLitShadeRate }>MToon LitShadeRate</option>
        <option value={ DebugMaterialMode.MToonUV }>MToon UV</option>
      </Select>
    </Root>
  );
};
