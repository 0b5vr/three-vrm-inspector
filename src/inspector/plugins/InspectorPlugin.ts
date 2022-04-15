import { Inspector } from '../Inspector';

export interface InspectorPlugin {
  inspector: Inspector;

  handleAfterSetup?: () => void;
  handleAfterLoad?: () => void;
  handleAfterUnload?: () => void;
  handleBeforeRender?: ( delta: number ) => void;
}
