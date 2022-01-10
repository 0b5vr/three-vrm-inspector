import { InspectorContext } from '../InspectorContext';
import { NameValueEntry } from './NameValueEntry';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useContext } from 'react';

// == element ======================================================================================
export const StatsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const dim = inspector.stats?.dimension.map( ( v ) => v.toFixed( 3 ) );
  const dimText = `( ${ dim?.[ 0 ] ?? 0.0 }, ${ dim?.[ 1 ] ?? 0.0 }, ${ dim?.[ 2 ] ?? 0.0 } )`;

  return (
    <Pane { ...params }>
      <PaneRoot>
        <NameValueEntry name="Dimension" value={ dimText } />
        <NameValueEntry name="Vertices" value={ inspector.stats?.vertices } />
        <NameValueEntry name="Polygons" value={ inspector.stats?.polygons } />
        <NameValueEntry name="Meshes" value={ inspector.stats?.meshes } />
        <NameValueEntry name="Primitives" value={ inspector.stats?.primitives } />
        <NameValueEntry name="Materials" value={ inspector.stats?.materials } />
        <NameValueEntry name="Spring Bones" value={ inspector.stats?.springBones } />
      </PaneRoot>
    </Pane>
  );
};
