import { useCallback, useContext } from 'react';
import { InspectorContext } from '../InspectorContext';

export const SampleModelsPaneButton = ( { name, url }: {
  name: string;
  url: string;
} ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const load = useCallback( () => {
    inspector.loadVRM( url );
  }, [ inspector ] );

  return <button value={ name } className="bg-gray-800 border border-gray-500 px-1 py-0 block" onClick={ load }>
    { name }
  </button>;
};
