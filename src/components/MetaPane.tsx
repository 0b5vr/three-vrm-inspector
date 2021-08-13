import { Pane, PaneParams } from './Pane';
import React, { useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { Meta0Content } from './Meta0Content';
import { Meta1Content } from './Meta1Content';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == element ======================================================================================
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
      <Root>
        { content }
      </Root>
    </Pane>
  );
};
