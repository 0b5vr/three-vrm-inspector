import { HelpersPaneCheckbox } from './HelpersPaneCheckbox';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext } from 'react';

export const LookAtPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChangeEnableLookAt = useCallback( ( checked ) => {
    inspector.lookAtPlugin.enableLookAt = checked;
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <HelpersPaneCheckbox
          callback={ handleChangeEnableLookAt }
          label="Enable LookAt"
        />
      </PaneRoot>
    </Pane>
  );
};
