import { InspectorAnimationPluginAnimation } from '../inspector/plugins/InspectorAnimationPlugin';
import { InspectorContext } from '../InspectorContext';
import { NameValueEntry } from './NameValueEntry';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext, useEffect, useState } from 'react';
import dancingFbx from '../assets/motions/dancing.fbx?url';
import gangnamStyleFbx from '../assets/motions/gangnam-style.fbx?url';
import jumpFbx from '../assets/motions/jump.fbx?url';
import runningFbx from '../assets/motions/running.fbx?url';
import standingClapFbx from '../assets/motions/standing-clap.fbx?url';
import testVrma from '../assets/motions/test.vrma?url';
import walkingFbx from '../assets/motions/walking.fbx?url';

// == animations ===================================================================================
const animations: InspectorAnimationPluginAnimation[] = [
  { name: 'Test (VRMA)', url: testVrma, type: 'vrma' },
  { name: 'Walking (Mixamo)', url: walkingFbx, type: 'mixamo' },
  { name: 'Running (Mixamo)', url: runningFbx, type: 'mixamo' },
  { name: 'Jump (Mixamo)', url: jumpFbx, type: 'mixamo' },
  { name: 'Dancing (Mixamo)', url: dancingFbx, type: 'mixamo' },
  { name: 'Standing Clap (Mixamo)', url: standingClapFbx, type: 'mixamo' },
  { name: 'Gangnam Style (Mixamo)', url: gangnamStyleFbx, type: 'mixamo' },
];

// == element ======================================================================================
export const AnimationsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  // listen to animation change
  const [ currentAnimation, setCurrentAnimation ]
    = useState<InspectorAnimationPluginAnimation | null>( null );

  useEffect( () => {
    const observer = ( animation: InspectorAnimationPluginAnimation | null ): void => {
      setCurrentAnimation( animation );
    };

    inspector.animationPlugin.animationChangeObservers.add( observer );
    return () => {
      inspector.animationPlugin.animationChangeObservers.delete( observer );
    };
  }, [ inspector ] );

  // listen to animation update
  const [ timeDisplay, setTimeDisplay ] = useState( '0.000 / 0.000' );

  useEffect( () => {
    const observer = ( { time, duration }: { time: number, duration: number } ): void => {
      setTimeDisplay( `${ time.toFixed( 3 ) } / ${ duration.toFixed( 3 ) }` );
    };

    inspector.animationPlugin.animationUpdateObservers.add( observer );
    return () => {
      inspector.animationPlugin.animationUpdateObservers.delete( observer );
    };
  }, [ inspector ] );

  // handle select change
  const handleSelectChange = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const i = parseInt( event.target.value, 10 );
      if ( i === -1 ) {
        inspector.animationPlugin.clearAnimation();
        return;
      }

      const animation = animations[ i ];
      inspector.animationPlugin.loadAnimation( animation );
    },
    [ inspector ]
  );

  // handle click play
  const handleClickPlay = useCallback(
    () => {
      inspector.animationPlugin.play();
    },
    [ inspector ]
  );

  // handle click pause
  const handleClickPause = useCallback(
    () => {
      inspector.animationPlugin.pause();
    },
    [ inspector ]
  );

  // handle click rewind
  const handleClickRewind = useCallback(
    () => {
      inspector.animationPlugin.rewind();
    },
    [ inspector ]
  );

  // element
  return (
    <Pane { ...params }>
      <PaneRoot>
        <select className="bg-gray-800 border border-gray-500 w-full" onChange={ handleSelectChange }>
          <option key={ -1 } value={ -1 }>(No animation)</option>
          {
            animations.map( ( { name }, i ) => (
              <option key={ i } value={ i }>{ name }</option>
            ) )
          }
        </select>
        <br />
        <button
          className="px-1 bg-gray-800 border border-gray-500"
          onClick={ handleClickPlay }
        >
          Play
        </button>
        <button
          className="ml-1 px-1 bg-gray-800 border border-gray-500"
          onClick={ handleClickPause }
        >
          Pause
        </button>
        <button
          className="ml-1 px-1 bg-gray-800 border border-gray-500"
          onClick={ handleClickRewind }
        >
          Rewind
        </button>
        <br />
        <NameValueEntry name="Animation" value={ currentAnimation?.name ?? '(not playing)' } />
        <NameValueEntry name="Time" value={ timeDisplay } />
      </PaneRoot>
    </Pane>
  );
};
