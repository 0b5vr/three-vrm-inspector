import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext, useEffect, useState } from 'react';
import type { InspectorLookAtTargetPosition } from '../inspector/plugins/InspectorLookAtPlugin';

const LOOK_AT_POSITION_AXES = ['X', 'Y', 'Z'] as const;

function NumberInputs(props: {
  targetPosition: InspectorLookAtTargetPosition;
  checkedEnableLookAt: boolean;
  handleChangeTargetPosition: (axisIndex: number, value: number) => void;
}) {
  const { targetPosition, checkedEnableLookAt, handleChangeTargetPosition } = props;

  return (
    <div className="mt-2 flex flex-col gap-1">
      {LOOK_AT_POSITION_AXES.map((axis, axisIndex) => (
        <div key={axis} className="flex gap-2">
          <label htmlFor={`look-at-position-${axis}`} className="text-gray-400">
            {axis}
          </label>
          <input
            id={`look-at-position-${axis}`}
            type="number"
            step="0.01"
            value={targetPosition[axisIndex].toFixed(3)}
            disabled={!checkedEnableLookAt}
            className="w-20 px-1 disabled:bg-gray-600 disabled:text-gray-400 border border-gray-500"
            onChange={(event) => {
              const value = event.currentTarget.valueAsNumber;
              if (Number.isFinite(value)) {
                handleChangeTargetPosition(axisIndex, value);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function LookAtPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);

  const [checkedEnableLookAt, setCheckedEnableLookAt] = useState(false);
  const [targetPosition, setTargetPosition] = useState<InspectorLookAtTargetPosition>(
    inspector.lookAtPlugin.targetPosition,
  );

  const handleChangeEnableLookAt = useCallback((checked: boolean) => {
    setCheckedEnableLookAt(checked);
    inspector.lookAtPlugin.enableLookAt = checked;
  }, [inspector]);

  const handleChangeTargetPosition = useCallback((axisIndex: number, value: number) => {
    const nextTargetPosition = targetPosition.slice() as InspectorLookAtTargetPosition;
    nextTargetPosition[axisIndex] = value;
    setTargetPosition(nextTargetPosition);
    inspector.lookAtPlugin.targetPosition = nextTargetPosition;
  }, [inspector, targetPosition]);

  useEffect(() => {
    const handleUpdate = ({ targetPosition: nextTargetPosition }: {
      targetPosition: InspectorLookAtTargetPosition;
    }): void => {
      setTargetPosition(nextTargetPosition);
    };

    inspector.lookAtPlugin.on('changeTargetPosition', handleUpdate);
    setTargetPosition(inspector.lookAtPlugin.targetPosition);

    return () => {
      inspector.lookAtPlugin.off('changeTargetPosition', handleUpdate);
    };
  }, [inspector]);

  return (
    <Pane {...params}>
      <PaneRoot>
        <HelpersPaneCheckbox
          callback={handleChangeEnableLookAt}
          label="Enable LookAt"
          checked={checkedEnableLookAt}
        />
        <NumberInputs
          targetPosition={targetPosition}
          checkedEnableLookAt={checkedEnableLookAt}
          handleChangeTargetPosition={handleChangeTargetPosition}
        />
      </PaneRoot>
    </Pane>
  );
}
