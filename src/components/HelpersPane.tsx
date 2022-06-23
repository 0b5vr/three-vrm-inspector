import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext } from 'react';

export const HelpersPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChangeHumanoid = useCallback( ( checked ) => {
    inspector.helpersPlugin.humanoidHelperRoot.visible = checked;
  }, [ inspector ] );

  const handleChangeHumanoidTransform = useCallback( ( checked ) => {
    inspector.humanoidTransformPlugin.active = checked;
  }, [ inspector ] );

  const handleChangeLookAt = useCallback( ( checked ) => {
    inspector.helpersPlugin.lookAtHelperRoot.visible = checked;
  }, [ inspector ] );

  const handleChangeSpringBones = useCallback( ( checked ) => {
    inspector.helpersPlugin.springBoneJointHelperRoot.visible = checked;
  }, [ inspector ] );

  const handleChangeSpringBoneColliders = useCallback( ( checked ) => {
    inspector.helpersPlugin.springBoneColliderHelperRoot.visible = checked;
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <HelpersPaneCheckbox
          callback={ handleChangeHumanoid }
          label="Humanoid"
          checked
        />
        <HelpersPaneCheckbox
          callback={ handleChangeHumanoidTransform }
          label="Humanoid Transform"
          checked
        />
        <HelpersPaneCheckbox
          callback={ handleChangeLookAt }
          label="LookAt"
          checked
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBones }
          label="Spring Bones"
          checked
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBoneColliders }
          label="Spring Bone Colliders"
          checked
        />
      </PaneRoot>
    </Pane>
  );
};
