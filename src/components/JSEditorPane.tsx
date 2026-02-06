import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import ReactCodeMirror, {
  type EditorView,
  type KeyBinding,
  keymap,
} from '@uiw/react-codemirror';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { InspectorContext } from '../InspectorContext';
import { Pane, type PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';

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

export function JSEditorPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);
  const [code, setCode] = useState(defaultCode);
  const refHasEdit = useRef(false);
  const refLastUnmount = useRef<(() => void) | null>(null);

  // -- event handlers -----------------------------------------------------------------------------
  useEffect(() => {
    // prevent terrible consequence
    window.addEventListener('beforeunload', (event) => {
      if (refHasEdit.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    });
  }, []);

  const handleRun = useCallback(
    (editor: EditorView) => {
      refLastUnmount.current?.();

      const code = editor.state.doc.toString();
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);

      import(url).then((mod) => {
        refLastUnmount.current = mod.default({ inspector, THREE });
        URL.revokeObjectURL(url);
      });

      return true;
    },
    [inspector],
  );

  const customKeymap: KeyBinding[] = useMemo(
    () => [
      {
        key: 'Mod-s',
        run: handleRun,
      },
      {
        key: 'Mod-r',
        run: handleRun,
      },
    ],
    [handleRun],
  );

  const handleChange = useCallback((code: string) => {
    setCode(code);
    refHasEdit.current = true;
  }, []);

  return (
    <Pane {...params}>
      <PaneRoot className="w-120 h-80" paddingClass="p-0">
        <ReactCodeMirror
          value={code}
          extensions={[javascript(), keymap.of(customKeymap)]}
          theme={vscodeDark}
          onChange={handleChange}
          className="h-full leading-tight"
          height="100%"
        />
      </PaneRoot>
    </Pane>
  );
}
