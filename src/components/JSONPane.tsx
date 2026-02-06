import type { GLTF } from '@gltf-transform/core';
import { useContext, useEffect, useState } from 'react';
import { InspectorContext } from '../InspectorContext';
import { JSONValue } from './JSONValue';
import { Pane, type PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';

function JSONPane(params: PaneParams) {
  const { inspector } = useContext(InspectorContext);
  const [root, setRoot] = useState<GLTF.IGLTF | null>(null);

  useEffect(() => {
    const handleLoad = (): void => {
      setRoot(inspector.model?.originalGLTFJSON ?? null);
    };

    inspector.on('load', handleLoad);

    return () => {
      inspector.off('load', handleLoad);
    };
  }, [inspector]);

  return (
    <Pane {...params}>
      <PaneRoot
        className="w-120 h-80 overflow-scroll whitespace-nowrap resize font-mono text-xs leading-tight"
        paddingClass="p-0"
      >
        <JSONValue value={root} />
      </PaneRoot>
    </Pane>
  );
}

export { JSONPane };
