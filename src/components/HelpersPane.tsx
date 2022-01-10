import { Pane, PaneParams } from './Pane';
import { useCallback, useContext } from 'react';
import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import { PaneRoot } from './PaneRoot';

export const HelpersPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChangeLookAt = useCallback( ( checked ) => {
    inspector.lookAtHelperRoot.visible = checked;
  }, [ inspector ] );

  const handleChangeSpringBones = useCallback( ( checked ) => {
    inspector.springBoneJointHelperRoot.visible = checked;
  }, [ inspector ] );

  const handleChangeSpringBoneColliders = useCallback( ( checked ) => {
    inspector.springBoneColliderHelperRoot.visible = checked;
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <HelpersPaneCheckbox
          callback={ handleChangeLookAt }
          label="LookAt"
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBones }
          label="Spring Bones"
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBoneColliders }
          label="Spring Bone Colliders"
        />
      </PaneRoot>
    </Pane>
  );
};
