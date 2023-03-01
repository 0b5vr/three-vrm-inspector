import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { Hr } from './Hr';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext, useEffect, useState } from 'react';

export const HelpersPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const [ checkedGrid, setCheckedGrid ] = useState( true );
  const [ checkedAxes, setCheckedAxes ] = useState( true );
  const [ checkedHumanoid, setCheckedHumanoid ] = useState( true );
  const [ checkedHumanoidTransform, setCheckedHumanoidTransform ] = useState( true );
  const [ checkedLookAt, setCheckedLookAt ] = useState( true );
  const [ checkedLookAtBall, setCheckedLookAtBall ] = useState( true );
  const [ checkedSpringBones, setCheckedSpringBones ] = useState( true );
  const [ checkedSpringBoneColliders, setCheckedSpringBoneColliders ] = useState( true );

  const handleClickEnableAll = useCallback( () => {
    setCheckedGrid( true );
    setCheckedAxes( true );
    setCheckedHumanoid( true );
    setCheckedHumanoidTransform( true );
    setCheckedLookAt( true );
    setCheckedLookAtBall( true );
    setCheckedSpringBones( true );
    setCheckedSpringBoneColliders( true );
  }, [] );

  const handleClickDisableAll = useCallback( () => {
    setCheckedGrid( false );
    setCheckedAxes( false );
    setCheckedHumanoid( false );
    setCheckedHumanoidTransform( false );
    setCheckedLookAt( false );
    setCheckedLookAtBall( false );
    setCheckedSpringBones( false );
    setCheckedSpringBoneColliders( false );
  }, [] );

  const handleChangeGrid = useCallback( ( checked ) => {
    setCheckedGrid( checked );
  }, [ inspector ] );

  const handleChangeAxes = useCallback( ( checked ) => {
    setCheckedAxes( checked );
  }, [ inspector ] );

  const handleChangeHumanoid = useCallback( ( checked ) => {
    setCheckedHumanoid( checked );
  }, [ inspector ] );

  const handleChangeHumanoidTransform = useCallback( ( checked ) => {
    setCheckedHumanoidTransform( checked );
  }, [ inspector ] );

  const handleChangeLookAt = useCallback( ( checked ) => {
    setCheckedLookAt( checked );
  }, [ inspector ] );

  const handleChangeLookAtBall = useCallback( ( checked ) => {
    setCheckedLookAtBall( checked );
  }, [ inspector ] );

  const handleChangeSpringBones = useCallback( ( checked ) => {
    setCheckedSpringBones( checked );
  }, [ inspector ] );

  const handleChangeSpringBoneColliders = useCallback( ( checked ) => {
    setCheckedSpringBoneColliders( checked );
  }, [ inspector ] );

  useEffect( () => {
    inspector.helpersPlugin.gridHelper.visible = checkedGrid;
  }, [ inspector, checkedGrid ] );

  useEffect( () => {
    inspector.helpersPlugin.axesHelper.visible = checkedAxes;
  }, [ inspector, checkedAxes ] );

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
    inspector.lookAtBallPlugin.isActive = checkedLookAtBall;
  }, [ inspector, checkedLookAtBall ] );

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
          callback={ handleChangeGrid }
          label="Grid"
          checked={ checkedGrid }
        />
        <HelpersPaneCheckbox
          callback={ handleChangeAxes }
          label="Axes"
          checked={ checkedAxes }
        />
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
          callback={ handleChangeLookAtBall }
          label="LookAt Ball"
          checked={ checkedLookAtBall }
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
