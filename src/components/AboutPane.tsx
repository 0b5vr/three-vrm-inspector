import { Pane, PaneParams } from './Pane';
import React from 'react';
import { Colors } from '../constants/Colors';
import styled from 'styled-components';

// == styles =======================================================================================
const Anchor = styled.a`
  color: ${ Colors.accent };
`;

const Line = styled.div`
  line-height: 20px;
`;

const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == microcomponents ==============================================================================
const Link = ( { link }: { link: string } ): JSX.Element => {
  return <Anchor href={ link } target="_blank" rel="noreferrer">{ link }</Anchor>;
};

// == element ======================================================================================
export const AboutPane = ( params: PaneParams ): JSX.Element => {
  return (
    <Pane { ...params }>
      <Root>
        <Line>three-vrm-inspector</Line>
        <Line>Three.js based VRM inspector</Line>
        <Line>Source: <Link link="https://github.com/0b5vr/three-vrm-inspector" /></Line>
      </Root>
    </Pane>
  );
};
