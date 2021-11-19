/* eslint-disable react/jsx-key */

import React, { useCallback, useState } from 'react';
import { BlendShapePane } from './BlendShapePane';
import { ExportBufferViewPane } from './ExportBufferViewPane';
import { HelpersPane } from './HelpersPane';
import { JSONPane } from './JSONPane';
import { MaterialDebuggerPane } from './MaterialDebuggerPane';
import { MetaPane } from './MetaPane';
import { MixamoAnimationsPane } from './MixamoAnimationsPane';
import { SampleModelsPane } from './SampleModelsPane';
import { StatsPane } from './StatsPane';
import { ValidationReportPane } from './ValidationReportPane';

// == element ======================================================================================
const PaneList = (): JSX.Element => {
  const [ order, setOrder ] = useState( [
    'jsonTree',
    'materialDebugger',
    'meta',
    'stats',
    'blendShape',
    'validationReport',
    'sampleModels',
    'helpers',
    'exportBufferView',
    'mixamoAnimations',
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

  const panes: { [ key: string ]: JSX.Element } = {
    'jsonTree': <JSONPane
      key="jsonTree"
      paneKey="jsonTree"
      title="JSON Tree"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 0 } }
    />,
    'materialDebugger': <MaterialDebuggerPane
      key="materialDebugger"
      paneKey="materialDebugger"
      title="MToon Material Debugger"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 20 } }
    />,
    'meta': <MetaPane
      key="meta"
      paneKey="meta"
      title="Meta"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 40 } }
    />,
    'stats': <StatsPane
      key="stats"
      paneKey="stats"
      title="Stats"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 60 } }
    />,
    'blendShape': <BlendShapePane
      key="blendShape"
      paneKey="blendShape"
      title="Blend Shape Proxy"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 80 } }
    />,
    'validationReport': <ValidationReportPane
      key="validationReport"
      paneKey="validationReport"
      title="Validation Report"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 100 } }
    />,
    'sampleModels': <SampleModelsPane
      key="sampleModels"
      paneKey="sampleModels"
      title="Sample Models"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 120 } }
    />,
    'helpers': <HelpersPane
      key="helpers"
      paneKey="helpers"
      title="Helpers"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 140 } }
    />,
    'exportBufferView': <ExportBufferViewPane
      key="exportBufferView"
      paneKey="exportBufferView"
      title="Export Buffer View"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 160 } }
    />,
    'mixamoAnimations': <MixamoAnimationsPane
      key="mixamoAnimations"
      paneKey="mixamoAnimations"
      title="Mixamo Animations"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 180 } }
    />,
  };

  return <>
    { order.map( ( paneKey ) => panes[ paneKey ] ) }
  </>;
};

export { PaneList };
