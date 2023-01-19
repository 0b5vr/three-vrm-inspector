import { HighlighterRuleFunction } from '../Highlighter';

export const highlightVRMFirstPersonMeshAnnotation: HighlighterRuleFunction
  = ( _, { inspector } ) => {
    inspector.layerMode = 'firstPerson';

    return () => {
      inspector.layerMode = 'thirdPerson';
    };
  };
