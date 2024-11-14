import { InspectorContext } from '../InspectorContext';
import { PaneList } from './PaneList';
import { ProgressBar } from './ProgressBar';
import { useCallback, useContext } from 'react';
import { useInspectorSubscribers } from '../stores/hooks/useInspectorSubscribers';

// == element ======================================================================================
const OutOfContextApp = (): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  useInspectorSubscribers( inspector );

  const canvas = useCallback( ( canvas: HTMLCanvasElement ) => {
    if ( canvas ) {
      inspector.setup( canvas );
    }
  }, [] );

  return <>
    <div className="w-full h-full text-sm absolute overflow-hidden text-gray-100">
      <canvas ref={ canvas } className="w-full h-full absolute" />
      <PaneList />
      <ProgressBar />
    </div>
  </>;
};

export const App = (): JSX.Element => <>
  <OutOfContextApp />
</>;
