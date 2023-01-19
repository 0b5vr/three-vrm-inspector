import { HighlighterRuleFunction } from '../Highlighter';
import { genGizmo } from '../utils/genGizmo';

export const highlightVRMLookAtOffset: HighlighterRuleFunction = ( _, { inspector } ) => {
  const mesh = genGizmo();
  const lookAt = inspector.model!.vrm!.lookAt!;
  lookAt.getLookAtWorldPosition( mesh.position );
  inspector.scene.add( mesh );

  return () => {
    inspector.scene.remove( mesh );
  };
};
