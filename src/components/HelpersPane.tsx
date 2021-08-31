import { Pane, PaneParams } from './Pane';
import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == element ======================================================================================
export const HelpersPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChangeSpringBones = useCallback( ( checked ) => {
    inspector.springBoneJointHelperRoot.visible = checked;
  }, [ inspector ] );

  const handleChangeSpringBoneColliders = useCallback( ( checked ) => {
    inspector.springBoneColliderHelperRoot.visible = checked;
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <Root>
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBones }
          label="Spring Bones"
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBoneColliders }
          label="Spring Bone Colliders"
        />
      </Root>
    </Pane>
  );
};
