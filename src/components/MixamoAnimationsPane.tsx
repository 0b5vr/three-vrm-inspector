import { Pane, PaneParams } from './Pane';
import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import dancingFbx from '../assets/motions/dancing.fbx';
import gangnamStyleFbx from '../assets/motions/gangnam-style.fbx';
import jumpFbx from '../assets/motions/jump.fbx';
import runningFbx from '../assets/motions/running.fbx';
import styled from 'styled-components';
import walkingFbx from '../assets/motions/walking.fbx';

// == animations ===================================================================================
const animations = [
  { name: '(No Animation)', url: '-' },
  { name: 'Walking', url: walkingFbx },
  { name: 'Running', url: runningFbx },
  { name: 'Jump', url: jumpFbx },
  { name: 'Dancing', url: dancingFbx },
  { name: 'Gangnam Style', url: gangnamStyleFbx },
];

// == styles =======================================================================================
const Select = styled.select`
  width: 100%;
`;
const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == element ======================================================================================
export const MixamoAnimationsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const name = event.target.value;
      if ( name === '-' ) {
        inspector.clearMixamoAnimation();
      } else {
        inspector.loadMixamoAnimation( name );
      }
    },
    [ inspector ]
  );

  return (
    <Pane { ...params }>
      <Root>
        <Select onChange={ handleSelectChange }>
          {
            animations.map( ( { name, url } ) => (
              <option key={ url } value={ url }>{ name }</option>
            ) )
          }
        </Select>
      </Root>
    </Pane>
  );
};
