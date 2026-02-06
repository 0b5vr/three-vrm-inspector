import { useCallback, useContext } from 'react';
import { InspectorContext } from '../InspectorContext';
import { useInspectorSubscribers } from '../stores/hooks/useInspectorSubscribers';
import { PaneList } from './PaneList';
import { ProgressBar } from './ProgressBar';

// == element ======================================================================================
function OutOfContextApp() {
  const { inspector } = useContext(InspectorContext);
  useInspectorSubscribers(inspector);

  const canvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        inspector.setup(canvas);
      }
    },
    [inspector],
  );

  return (
    <div className="w-full h-full text-sm absolute overflow-hidden text-gray-100">
      <canvas ref={canvas} className="w-full h-full absolute" />
      <PaneList />
      <ProgressBar />
    </div>
  );
}

export function App() {
  return <OutOfContextApp />;
}
