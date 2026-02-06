import { useCallback, useContext, useState } from 'react';
import { InspectorContext } from '../InspectorContext';
import { CheckboxRow } from './CheckboxRow';
import { Hr } from './Hr';
import { Pane, type PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { RangeRow } from './RangeRow';

// == element ======================================================================================
export function PostProcessingPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);

  const [isBloomEnabled, setBloomEnabled] = useState(false);

  const onChangeBloomEnabled = useCallback(
    (value: boolean) => {
      inspector.postProcessingPlugin.bloomPass.enabled = value;
      setBloomEnabled(value);
    },
    [inspector],
  );

  const onChangeBloomStrength = useCallback(
    (value: number) => {
      inspector.postProcessingPlugin.bloomPass.strength = 4.0 * value;
    },
    [inspector],
  );

  const onChangeBloomRadius = useCallback(
    (value: number) => {
      inspector.postProcessingPlugin.bloomPass.radius = value;
    },
    [inspector],
  );

  const onChangeBloomThreshold = useCallback(
    (value: number) => {
      inspector.postProcessingPlugin.bloomPass.threshold = 4.0 * value;
    },
    [inspector],
  );

  const [isToneMappingEnabled, setToneMappingEnabled] = useState(false);

  const onChangeToneMappingEnabled = useCallback(
    (value: boolean) => {
      inspector.postProcessingPlugin.toneMappingPass.enabled = value;
      setToneMappingEnabled(value);
    },
    [inspector],
  );

  const onChangeToneMappingExposure = useCallback(
    (value: number) => {
      inspector.postProcessingPlugin.toneMappingPass.uniforms.exposure.value =
        2.0 * value;
    },
    [inspector],
  );

  return (
    <Pane {...params}>
      <PaneRoot>
        <h3 className="text-lg font-bold">Bloom</h3>
        <CheckboxRow
          label="Enabled"
          defaultChecked={false}
          onChange={onChangeBloomEnabled}
        />
        <RangeRow
          label="Strength"
          defaultValue={0.25}
          disabled={!isBloomEnabled}
          onChange={onChangeBloomStrength}
        />
        <RangeRow
          label="Radius"
          defaultValue={0.5}
          disabled={!isBloomEnabled}
          onChange={onChangeBloomRadius}
        />
        <RangeRow
          label="Threshold"
          defaultValue={0.25}
          disabled={!isBloomEnabled}
          onChange={onChangeBloomThreshold}
        />
        <Hr />
        <h3 className="text-lg font-bold">ACES Tone Mapping</h3>
        <CheckboxRow
          label="Enabled"
          defaultChecked={false}
          onChange={onChangeToneMappingEnabled}
        />
        <RangeRow
          label="Exposure"
          defaultValue={0.5}
          disabled={!isToneMappingEnabled}
          onChange={onChangeToneMappingExposure}
        />
      </PaneRoot>
    </Pane>
  );
}
