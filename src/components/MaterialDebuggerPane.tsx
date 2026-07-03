import { InspectorContext } from '../InspectorContext';
import { MaterialDebuggerMode } from '../inspector/MaterialDebugger';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { useCallback, useContext } from 'react';

export function MaterialDebuggerPane(params: PaneParams) {
  const { materialDebugger } = useContext(InspectorContext);

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const mode = parseInt(event.target.value) as MaterialDebuggerMode;

      materialDebugger.applyMode(mode);
    },
    [materialDebugger],
  );

  return (
    <Pane {...params}>
      <PaneRoot>
        <select className="bg-gray-800 border border-gray-500 w-full" onChange={handleSelectChange}>
          <option value={MaterialDebuggerMode.None}>None</option>
          <option value={MaterialDebuggerMode.MToonNormal}>MToon Normal</option>
          <option value={MaterialDebuggerMode.MToonLitShadeRate}>MToon LitShadeRate</option>
          <option value={MaterialDebuggerMode.MToonUV}>MToon UV</option>
          <option value={MaterialDebuggerMode.UVGrid}>UV Grid</option>
          <option value={MaterialDebuggerMode.RenderQueue}>Render Queue</option>
        </select>
      </PaneRoot>
    </Pane>
  );
}
