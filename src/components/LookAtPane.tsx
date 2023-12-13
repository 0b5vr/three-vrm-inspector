import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext, useState } from 'react';

export const LookAtPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const [ checkedEnableLookAt, setCheckedEnableLookAt ] = useState( false );

  const handleChangeEnableLookAt = useCallback( ( checked ) => {
    setCheckedEnableLookAt( checked );
    inspector.lookAtPlugin.enableLookAt = checked;
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <HelpersPaneCheckbox
          callback={ handleChangeEnableLookAt }
          label="Enable LookAt"
          checked={ checkedEnableLookAt }
        />
      </PaneRoot>
    </Pane>
  );
};
