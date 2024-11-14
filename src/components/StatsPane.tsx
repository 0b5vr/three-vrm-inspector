import { NameValueEntry } from './NameValueEntry';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { statsAtom } from '../stores/atoms/statsAtom';
import { useAtomValue } from 'jotai';

// == element ======================================================================================
export const StatsPane = ( params: PaneParams ): JSX.Element => {
  const stats = useAtomValue( statsAtom );

  const dim = stats?.dimension.map( ( v ) => v.toFixed( 3 ) );
  const dimText = `( ${ dim?.[ 0 ] ?? 0.0 }, ${ dim?.[ 1 ] ?? 0.0 }, ${ dim?.[ 2 ] ?? 0.0 } )`;

  return (
    <Pane { ...params }>
      <PaneRoot>
        <NameValueEntry name="Dimension" value={ dimText } />
        <NameValueEntry name="Vertices" value={ stats?.vertices } />
        <NameValueEntry name="Polygons" value={ stats?.polygons } />
        <NameValueEntry name="Meshes" value={ stats?.meshes } />
        <NameValueEntry name="Primitives" value={ stats?.primitives } />
        <NameValueEntry name="Textures" value={ stats?.textures } />
        <NameValueEntry name="Materials" value={ stats?.materials } />
        <NameValueEntry name="Spring Bone Joints" value={ stats?.joints } />
      </PaneRoot>
    </Pane>
  );
};
