import './codemirror-themes/monokai-sharp.css';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import * as THREE from 'three';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { Controlled as ReactCodeMirror } from 'react-codemirror2';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';

const defaultCode = `// Press Ctrl+S or Ctrl+R to apply
// The api will be changed without notice! Use at your own risk

export default ( { inspector, THREE } ) => {
  let isUnmounted = false;

  const vrm = inspector.model.vrm;

  // update
  const beginTime = Date.now();

  function update() {
    if ( isUnmounted ) { return; }

    const time = 0.001 * ( Date.now() - beginTime );

    const leftUpperArm = vrm.humanoid?.getNormalizedBoneNode( 'leftUpperArm' );
    if ( leftUpperArm != null ) {
      leftUpperArm.rotation.z = Math.sin( time );
    }

    requestAnimationFrame( update );
  }
  requestAnimationFrame( update );

  // uninit
  return () => {
    isUnmounted = true;
  };
}
`;

export const JSEditorPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const [ code, setCode ] = useState( defaultCode );
  const [ hasEdited, setHasEdited ] = useState( false );
  const refLastUnmount = useRef<() => void>();

  // -- event handlers -----------------------------------------------------------------------------
  useEffect( () => {
    // prevent terrible consequence
    window.addEventListener( 'beforeunload', ( event ) => {
      if ( hasEdited ) {
        const confirmationMessage = 'You will lose all of your changes on the editor!';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    } );
  }, [ hasEdited ] );

  const handleCompile = useCallback(
    ( code ) => {
      refLastUnmount.current?.();

      const blob = new Blob( [ code ], { type: 'text/javascript' } );
      const url = URL.createObjectURL( blob );

      import( url ).then( ( mod ) => {
        refLastUnmount.current = mod.default( { inspector, THREE } );
        URL.revokeObjectURL( url );
      } );
    },
    [ inspector ],
  );

  const handleEditorDidMount = useCallback(
    ( editor: CodeMirror.Editor ) => {
      editor.addKeyMap( {
        'Ctrl-S': () => {
          handleCompile( editor.getValue() );
        },
        'Ctrl-R': () => {
          handleCompile( editor.getValue() );
        },
      } );
    },
    [ handleCompile ]
  );

  const handleBeforeChange = useCallback(
    ( editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string ) => {
      setCode( value );
      setHasEdited( true );
    },
    []
  );

  const handleChange = useCallback(
    () => {
      // do nothing
    },
    []
  );

  return (
    <Pane { ...params }>
      <PaneRoot
        className="w-120 h-80"
        paddingClass="p-0"
      >
        <ReactCodeMirror
          value={ code }
          options={ {
            mode: 'text/javascript',
            keyMap: 'sublime',
            theme: 'monokai-sharp',
            lineNumbers: true
          } }
          editorDidMount={ handleEditorDidMount }
          onBeforeChange={ handleBeforeChange }
          onChange={ handleChange }
          className="h-full leading-tight"
        />
      </PaneRoot>
    </Pane>
  );
};
