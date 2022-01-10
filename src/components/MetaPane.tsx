import { InspectorContext } from '../InspectorContext';
import { Meta0Content } from './Meta0Content';
import { Meta1Content } from './Meta1Content';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useContext } from 'react';

export const MetaPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const meta = inspector.vrm?.meta;

  let content: JSX.Element = <>No meta detected.</>;

  if ( meta?.metaVersion === '1' ) {
    content = <Meta1Content meta={ meta } />;
  } else if ( meta?.metaVersion === '0' ) {
    content = <Meta0Content meta={ meta } />;
  }

  return (
    <Pane { ...params }>
      <PaneRoot>
        { content }
      </PaneRoot>
    </Pane>
  );
};
