import { HighlighterRuleFunction } from '../Highlighter';

export const highlightVRMFirstPersonMeshAnnotation: HighlighterRuleFunction
  = async (_, { inspector }) => {
    inspector.layerMode = 'firstPerson';

    return () => {
      inspector.layerMode = 'thirdPerson';
    };
  };
