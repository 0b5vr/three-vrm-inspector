import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { Hr } from './Hr';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext, useEffect, useState } from 'react';

export const HelpersPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const [ checkedHumanoid, setCheckedHumanoid ] = useState( true );
  const [ checkedHumanoidTransform, setCheckedHumanoidTransform ] = useState( true );
  const [ checkedLookAt, setCheckedLookAt ] = useState( true );
  const [ checkedSpringBones, setCheckedSpringBones ] = useState( true );
  const [ checkedSpringBoneColliders, setCheckedSpringBoneColliders ] = useState( true );

  const handleClickEnableAll = useCallback( () => {
    setCheckedHumanoid( true );
    setCheckedHumanoidTransform( true );
    setCheckedLookAt( true );
    setCheckedSpringBones( true );
    setCheckedSpringBoneColliders( true );
  }, [] );

  const handleClickDisableAll = useCallback( () => {
    setCheckedHumanoid( false );
    setCheckedHumanoidTransform( false );
    setCheckedLookAt( false );
    setCheckedSpringBones( false );
    setCheckedSpringBoneColliders( false );
  }, [] );

  const handleChangeHumanoid = useCallback( ( checked ) => {
    setCheckedHumanoid( checked );
  }, [ inspector ] );

  const handleChangeHumanoidTransform = useCallback( ( checked ) => {
    setCheckedHumanoidTransform( checked );
  }, [ inspector ] );

  const handleChangeLookAt = useCallback( ( checked ) => {
    setCheckedLookAt( checked );
  }, [ inspector ] );

  const handleChangeSpringBones = useCallback( ( checked ) => {
    setCheckedSpringBones( checked );
  }, [ inspector ] );

  const handleChangeSpringBoneColliders = useCallback( ( checked ) => {
    setCheckedSpringBoneColliders( checked );
  }, [ inspector ] );

  useEffect( () => {
    inspector.helpersPlugin.humanoidHelperRoot.visible = checkedHumanoid;
  }, [ inspector, checkedHumanoid ] );

  useEffect( () => {
    inspector.humanoidTransformPlugin.active = checkedHumanoidTransform;
  }, [ inspector, checkedHumanoidTransform ] );

  useEffect( () => {
    inspector.helpersPlugin.lookAtHelperRoot.visible = checkedLookAt;
  }, [ inspector, checkedLookAt ] );

  useEffect( () => {
    inspector.helpersPlugin.springBoneJointHelperRoot.visible = checkedSpringBones;
  }, [ inspector, checkedSpringBones ] );

  useEffect( () => {
    inspector.helpersPlugin.springBoneColliderHelperRoot.visible = checkedSpringBoneColliders;
  }, [ inspector, checkedSpringBoneColliders ] );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <button
          className="ml-1 px-1 bg-gray-800 border border-gray-500"
          onClick={ handleClickEnableAll }
        >
          Enable All
        </button>
        <button
          className="ml-1 px-1 bg-gray-800 border border-gray-500"
          onClick={ handleClickDisableAll }
        >
          Disable All
        </button>

        <Hr />

        <HelpersPaneCheckbox
          callback={ handleChangeHumanoid }
          label="Humanoid"
          checked={ checkedHumanoid }
        />
        <HelpersPaneCheckbox
          callback={ handleChangeHumanoidTransform }
          label="Humanoid Transform"
          checked={ checkedHumanoidTransform }
        />
        <HelpersPaneCheckbox
          callback={ handleChangeLookAt }
          label="LookAt"
          checked={ checkedLookAt }
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBones }
          label="Spring Bones"
          checked={ checkedSpringBones }
        />
        <HelpersPaneCheckbox
          callback={ handleChangeSpringBoneColliders }
          label="Spring Bone Colliders"
          checked={ checkedSpringBoneColliders }
        />
      </PaneRoot>
    </Pane>
  );
};
