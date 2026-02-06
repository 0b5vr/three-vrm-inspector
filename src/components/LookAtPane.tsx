import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext, useState } from 'react';

export function LookAtPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);

  const [checkedEnableLookAt, setCheckedEnableLookAt] = useState(false);

  const handleChangeEnableLookAt = useCallback((checked: boolean) => {
    setCheckedEnableLookAt(checked);
    inspector.lookAtPlugin.enableLookAt = checked;
  }, [inspector]);

  return (
    <Pane {...params}>
      <PaneRoot>
        <HelpersPaneCheckbox
          callback={handleChangeEnableLookAt}
          label="Enable LookAt"
          checked={checkedEnableLookAt}
        />
      </PaneRoot>
    </Pane>
  );
}
