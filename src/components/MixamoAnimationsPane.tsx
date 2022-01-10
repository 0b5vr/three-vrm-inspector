import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext } from 'react';
import dancingFbx from '../assets/motions/dancing.fbx';
import gangnamStyleFbx from '../assets/motions/gangnam-style.fbx';
import jumpFbx from '../assets/motions/jump.fbx';
import runningFbx from '../assets/motions/running.fbx';
import walkingFbx from '../assets/motions/walking.fbx';

// == animations ===================================================================================
const animations = [
  { name: '(No Animation)', url: '-' },
  { name: 'Walking', url: walkingFbx },
  { name: 'Running', url: runningFbx },
  { name: 'Jump', url: jumpFbx },
  { name: 'Dancing', url: dancingFbx },
  { name: 'Gangnam Style', url: gangnamStyleFbx },
];

// == element ======================================================================================
export const MixamoAnimationsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const name = event.target.value;
      if ( name === '-' ) {
        inspector.clearMixamoAnimation();
      } else {
        inspector.loadMixamoAnimation( name );
      }
    },
    [ inspector ]
  );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <select className="bg-gray-800 border border-gray-500 w-full" onChange={ handleSelectChange }>
          {
            animations.map( ( { name, url } ) => (
              <option key={ url } value={ url }>{ name }</option>
            ) )
          }
        </select>
      </PaneRoot>
    </Pane>
  );
};
