import { InspectorContext } from '../InspectorContext';
import { Meta0Content } from './Meta0Content';
import { Meta1Content } from './Meta1Content';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import React, { useContext } from 'react';

export function MetaPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);

  const meta = inspector.model?.vrm?.meta;

  let content: React.ReactNode = <>No meta detected.</>;

  if (meta?.metaVersion === '1') {
    content = <Meta1Content meta={meta} />;
  } else if (meta?.metaVersion === '0') {
    content = <Meta0Content meta={meta} />;
  }

  return (
    <Pane {...params}>
      <PaneRoot>
        { content }
      </PaneRoot>
    </Pane>
  );
}
