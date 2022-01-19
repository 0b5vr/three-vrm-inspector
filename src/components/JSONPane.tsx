import { InspectorContext } from '../InspectorContext';
import { JSONValue } from './JSONValue';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useContext, useEffect, useState } from 'react';

const JSONPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const [ root, setRoot ] = useState<any>( undefined );

  useEffect( () => {
    const handleLoad = (): void => {
      setRoot( inspector.model?.originalGLTFJSON );
    };

    inspector.on( 'load', handleLoad );

    return () => {
      inspector.off( 'load', handleLoad );
    };
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <PaneRoot
        className="w-120 h-80 overflow-scroll whitespace-nowrap resize font-mono text-xs leading-tight"
        paddingClass="p-0"
      >
        <JSONValue value={ root } />
      </PaneRoot>
    </Pane>
  );
};

export { JSONPane };
