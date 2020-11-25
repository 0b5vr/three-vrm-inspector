import React, { useCallback, useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { Metrics } from '../constants/Metrics';
import { PaneList } from './PaneList';
import { ProgressBar } from './ProgressBar';

// == styles =======================================================================================
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono:400');

  html {
    font-size: ${ Metrics.rootFontSize };
  }

  body {
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`;

const Canvas = styled.canvas`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Root = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  color: ${ Colors.fore };
`;


// == element ======================================================================================
const OutOfContextApp = (): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const canvas = useCallback( ( canvas: HTMLCanvasElement ) => {
    if ( canvas ) {
      inspector.setup( canvas );
    }
  }, [] );

  return <>
    <Root>
      <Canvas ref={ canvas } />
      <PaneList />
      <ProgressBar />
    </Root>
  </>;
};

export const App = (): JSX.Element => <>
  <GlobalStyle />
  <OutOfContextApp />
</>;
