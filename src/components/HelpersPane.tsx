import { useCallback, useContext, useEffect, useState } from 'react';
import { InspectorContext } from '../InspectorContext';
import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { Hr } from './Hr';
import { Pane, type PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';

export function HelpersPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);

  const [checkedGrid, setCheckedGrid] = useState(
    inspector.helpersPlugin.gridHelper.visible,
  );
  const [checkedAxes, setCheckedAxes] = useState(
    inspector.helpersPlugin.axesHelper.visible,
  );
  const [checkedHumanoid, setCheckedHumanoid] = useState(
    inspector.helpersPlugin.humanoidHelperRoot.visible,
  );
  const [checkedHumanoidTransform, setCheckedHumanoidTransform] = useState(
    inspector.humanoidTransformPlugin.active,
  );
  const [checkedLookAt, setCheckedLookAt] = useState(
    inspector.helpersPlugin.lookAtHelperRoot.visible,
  );
  const [checkedLookAtBall, setCheckedLookAtBall] = useState(
    inspector.lookAtBallPlugin.isActive,
  );
  const [checkedSpringBones, setCheckedSpringBones] = useState(
    inspector.helpersPlugin.springBoneJointHelperRoot.visible,
  );
  const [checkedSpringBoneColliders, setCheckedSpringBoneColliders] = useState(
    inspector.helpersPlugin.springBoneColliderHelperRoot.visible,
  );

  const handleClickEnableAll = useCallback(() => {
    setCheckedGrid(true);
    setCheckedAxes(true);
    setCheckedHumanoid(true);
    setCheckedHumanoidTransform(true);
    setCheckedLookAt(true);
    setCheckedLookAtBall(true);
    setCheckedSpringBones(true);
    setCheckedSpringBoneColliders(true);
  }, []);

  const handleClickDisableAll = useCallback(() => {
    setCheckedGrid(false);
    setCheckedAxes(false);
    setCheckedHumanoid(false);
    setCheckedHumanoidTransform(false);
    setCheckedLookAt(false);
    setCheckedLookAtBall(false);
    setCheckedSpringBones(false);
    setCheckedSpringBoneColliders(false);
  }, []);

  const handleChangeGrid = useCallback((checked: boolean) => {
    setCheckedGrid(checked);
  }, []);

  const handleChangeAxes = useCallback((checked: boolean) => {
    setCheckedAxes(checked);
  }, []);

  const handleChangeHumanoid = useCallback((checked: boolean) => {
    setCheckedHumanoid(checked);
  }, []);

  const handleChangeHumanoidTransform = useCallback((checked: boolean) => {
    setCheckedHumanoidTransform(checked);
  }, []);

  const handleChangeLookAt = useCallback((checked: boolean) => {
    setCheckedLookAt(checked);
  }, []);

  const handleChangeLookAtBall = useCallback((checked: boolean) => {
    setCheckedLookAtBall(checked);
  }, []);

  const handleChangeSpringBones = useCallback((checked: boolean) => {
    setCheckedSpringBones(checked);
  }, []);

  const handleChangeSpringBoneColliders = useCallback((checked: boolean) => {
    setCheckedSpringBoneColliders(checked);
  }, []);

  useEffect(() => {
    inspector.helpersPlugin.gridHelper.visible = checkedGrid;
  }, [inspector, checkedGrid]);

  useEffect(() => {
    inspector.helpersPlugin.axesHelper.visible = checkedAxes;
  }, [inspector, checkedAxes]);

  useEffect(() => {
    inspector.helpersPlugin.humanoidHelperRoot.visible = checkedHumanoid;
  }, [inspector, checkedHumanoid]);

  useEffect(() => {
    inspector.humanoidTransformPlugin.active = checkedHumanoidTransform;
  }, [inspector, checkedHumanoidTransform]);

  useEffect(() => {
    inspector.helpersPlugin.lookAtHelperRoot.visible = checkedLookAt;
  }, [inspector, checkedLookAt]);

  useEffect(() => {
    inspector.lookAtBallPlugin.isActive = checkedLookAtBall;
  }, [inspector, checkedLookAtBall]);

  useEffect(() => {
    inspector.helpersPlugin.springBoneJointHelperRoot.visible =
      checkedSpringBones;
  }, [inspector, checkedSpringBones]);

  useEffect(() => {
    inspector.helpersPlugin.springBoneColliderHelperRoot.visible =
      checkedSpringBoneColliders;
  }, [inspector, checkedSpringBoneColliders]);

  return (
    <Pane {...params}>
      <PaneRoot>
        <button
          type="button"
          className="ml-1 px-1 bg-gray-800 border border-gray-500"
          onClick={handleClickEnableAll}
        >
          Enable All
        </button>
        <button
          type="button"
          className="ml-1 px-1 bg-gray-800 border border-gray-500"
          onClick={handleClickDisableAll}
        >
          Disable All
        </button>

        <Hr />

        <HelpersPaneCheckbox
          callback={handleChangeGrid}
          label="Grid"
          checked={checkedGrid}
        />
        <HelpersPaneCheckbox
          callback={handleChangeAxes}
          label="Axes"
          checked={checkedAxes}
        />
        <HelpersPaneCheckbox
          callback={handleChangeHumanoid}
          label="Humanoid"
          checked={checkedHumanoid}
        />
        <HelpersPaneCheckbox
          callback={handleChangeHumanoidTransform}
          label="Humanoid Transform"
          checked={checkedHumanoidTransform}
        />
        <HelpersPaneCheckbox
          callback={handleChangeLookAt}
          label="LookAt"
          checked={checkedLookAt}
        />
        <HelpersPaneCheckbox
          callback={handleChangeLookAtBall}
          label="LookAt Ball"
          checked={checkedLookAtBall}
        />
        <HelpersPaneCheckbox
          callback={handleChangeSpringBones}
          label="Spring Bones"
          checked={checkedSpringBones}
        />
        <HelpersPaneCheckbox
          callback={handleChangeSpringBoneColliders}
          label="Spring Bone Colliders"
          checked={checkedSpringBoneColliders}
        />
      </PaneRoot>
    </Pane>
  );
}
