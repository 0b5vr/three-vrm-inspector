/* eslint-disable react/jsx-key */

import { AboutPane } from './AboutPane';
import { AnimationsPane } from './AnimationsPane';
import { BlendShapePane } from './BlendShapePane';
import { ExportBufferViewPane } from './ExportBufferViewPane';
import { HelpersPane } from './HelpersPane';
import { JSEditorPane } from './JSEditorPane';
import { JSONPane } from './JSONPane';
import { LookAtPane } from './LookAtPane';
import { MaterialDebuggerPane } from './MaterialDebuggerPane';
import { MetaPane } from './MetaPane';
import { PostProcessingPane } from './PostProcessingPane';
import { SampleModelsPane } from './SampleModelsPane';
import { StatsPane } from './StatsPane';
import { ValidationReportPane } from './ValidationReportPane';
import { WebGLMemoryPane } from './WebGLMemoryPane';
import React, { useCallback, useState } from 'react';

// == element ======================================================================================
const PaneList = (): JSX.Element => {
  const [ order, setOrder ] = useState( [
    'jsonTree',
    'materialDebugger',
    'meta',
    'stats',
    'webglMemory',
    'blendShape',
    'lookAt',
    'validationReport',
    'sampleModels',
    'helpers',
    'exportBufferView',
    'animations',
    'postProcessing',
    'jsEditor',
    'about',
  ] );

  const handleClick = useCallback(
    ( event: React.MouseEvent, paneKey: string ) => {
      const newOrder = order.concat();
      newOrder.splice( order.indexOf( paneKey ), 1 );
      newOrder.push( paneKey );

      setOrder( newOrder );
    },
    [ order ]
  );

  let currentInitPositionTop = 0;
  const generateInitPosition = (): { left: number, top: number } => {
    const left = 0;
    const top = currentInitPositionTop;

    currentInitPositionTop += 20;

    return { left, top };
  };

  const panes: { [ key: string ]: JSX.Element } = {
    'jsonTree': <JSONPane
      key="jsonTree"
      paneKey="jsonTree"
      title="JSON Tree"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'materialDebugger': <MaterialDebuggerPane
      key="materialDebugger"
      paneKey="materialDebugger"
      title="MToon Material Debugger"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'meta': <MetaPane
      key="meta"
      paneKey="meta"
      title="Meta"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'stats': <StatsPane
      key="stats"
      paneKey="stats"
      title="Stats"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'webglMemory': <WebGLMemoryPane
      key="webglMemory"
      paneKey="webglMemory"
      title="WebGL Memory"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'blendShape': <BlendShapePane
      key="blendShape"
      paneKey="blendShape"
      title="Blend Shape Proxy"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'lookAt': <LookAtPane
      key="lookAt"
      paneKey="lookAt"
      title="Look At"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'validationReport': <ValidationReportPane
      key="validationReport"
      paneKey="validationReport"
      title="Validation Report"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'sampleModels': <SampleModelsPane
      key="sampleModels"
      paneKey="sampleModels"
      title="Sample Models"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'helpers': <HelpersPane
      key="helpers"
      paneKey="helpers"
      title="Helpers"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'exportBufferView': <ExportBufferViewPane
      key="exportBufferView"
      paneKey="exportBufferView"
      title="Export Buffer View"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'animations': <AnimationsPane
      key="animations"
      paneKey="animations"
      title="Animations"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'postProcessing': <PostProcessingPane
      key="postProcessing"
      paneKey="postProcessing"
      title="Post Processing"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'jsEditor': <JSEditorPane
      key="jsEditor"
      paneKey="jsEditor"
      title="JavaScript Editor"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
    'about': <AboutPane
      key="about"
      paneKey="about"
      title="About"
      onClick={ handleClick }
      initPosition={ generateInitPosition() }
    />,
  };

  return <>
    { order.map( ( paneKey ) => panes[ paneKey ] ) }
  </>;
};

export { PaneList };
