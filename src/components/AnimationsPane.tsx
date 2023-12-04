import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext } from 'react';
import dancingFbx from '../assets/motions/dancing.fbx?url';
import gangnamStyleFbx from '../assets/motions/gangnam-style.fbx?url';
import jumpFbx from '../assets/motions/jump.fbx?url';
import runningFbx from '../assets/motions/running.fbx?url';
import standingClapFbx from '../assets/motions/standing-clap.fbx?url';
import testVrma from '../assets/motions/test.vrma?url';
import walkingFbx from '../assets/motions/walking.fbx?url';

// == animations ===================================================================================
const animations: {
  name: string;
  value: {
    type: 'vrma' | 'mixamo';
    url: string;
  } | null;
}[] = [
  { name: '(No Animation)', value: null },
  { name: 'Test (VRMA)', value: { url: testVrma, type: 'vrma' } },
  { name: 'Walking (Mixamo)', value: { url: walkingFbx, type: 'mixamo' } },
  { name: 'Running (Mixamo)', value: { url: runningFbx, type: 'mixamo' } },
  { name: 'Jump (Mixamo)', value: { url: jumpFbx, type: 'mixamo' } },
  { name: 'Dancing (Mixamo)', value: { url: dancingFbx, type: 'mixamo' } },
  { name: 'Standing Clap (Mixamo)', value: { url: standingClapFbx, type: 'mixamo' } },
  { name: 'Gangnam Style (Mixamo)', value: { url: gangnamStyleFbx, type: 'mixamo' } },
];

// == element ======================================================================================
export const AnimationsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const i = parseInt( event.target.value, 10 );
      const { value } = animations[ i ];

      if ( value == null ) {
        inspector.animationPlugin.clearAnimation();
      } else {
        inspector.animationPlugin.loadAnimation( value );
      }
    },
    [ inspector ]
  );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <select className="bg-gray-800 border border-gray-500 w-full" onChange={ handleSelectChange }>
          {
            animations.map( ( { name }, i ) => (
              <option key={ i } value={ i }>{ name }</option>
            ) )
          }
        </select>
      </PaneRoot>
    </Pane>
  );
};
