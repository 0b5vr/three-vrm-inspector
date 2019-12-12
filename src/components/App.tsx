import React, { useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';

// == styles =======================================================================================
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');
`;

const Div = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
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
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  font-size: ${ Metrics.rootFontSize };
  color: ${ Colors.fore };
  user-select: none;
`;


// == element ======================================================================================
export interface AppProps {
  onCanvasInit: ( canvas: HTMLCanvasElement ) => void;
  progress: ProgressEvent | null;
}

export const App = ( { onCanvasInit, progress }: AppProps ): JSX.Element => {
  const canvas = useCallback( ( canvas: HTMLCanvasElement ) => {
    if ( canvas ) {
      onCanvasInit( canvas );
    }
  }, [] );

  return <>
    <GlobalStyle />
    <Root>
      <Canvas ref={ canvas } />
      <Div>{ progress?.toString() ?? 'yay' }</Div>
    </Root>
  </>;
};
