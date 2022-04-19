import { Inspector } from '../Inspector';
import { InspectorModel } from '../InspectorModel';

export interface InspectorPlugin {
  inspector: Inspector;

  handleAfterSetup?: () => void;
  handleAfterLoad?: ( model: InspectorModel ) => void;
  handleAfterUnload?: () => void;
  handleBeforeRender?: ( delta: number ) => void;
}
