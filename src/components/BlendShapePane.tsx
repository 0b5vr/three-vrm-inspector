import { BlendShapeRow } from './BlendShapeRow';
import { Hr } from './Hr';
import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { VRMExpressionPresetName } from '@pixiv/three-vrm';
import { useContext } from 'react';

// == constants ====================================================================================
const presets: VRMExpressionPresetName[] = [
  VRMExpressionPresetName.Neutral,
  VRMExpressionPresetName.Happy,
  VRMExpressionPresetName.Angry,
  VRMExpressionPresetName.Sad,
  VRMExpressionPresetName.Relaxed,
  VRMExpressionPresetName.Surprised,
  VRMExpressionPresetName.Blink,
  VRMExpressionPresetName.BlinkLeft,
  VRMExpressionPresetName.BlinkRight,
  VRMExpressionPresetName.Aa,
  VRMExpressionPresetName.Ee,
  VRMExpressionPresetName.Ih,
  VRMExpressionPresetName.Oh,
  VRMExpressionPresetName.Ou,
  VRMExpressionPresetName.LookLeft,
  VRMExpressionPresetName.LookRight,
  VRMExpressionPresetName.LookDown,
  VRMExpressionPresetName.LookUp,
];
const presetSet: Set<string> = new Set( presets );

// == element ======================================================================================
export const BlendShapePane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const expressionManager = inspector.vrm?.expressionManager;
  const expressionMap = expressionManager?.expressionMap;

  const customNames: string[] = [];
  if ( expressionMap ) {
    Array.from( Object.keys( expressionMap ) ).forEach( ( name ) => {
      if ( !presetSet.has( name ) ) {
        customNames.push( name );
      }
    } );
  }

  const hasUnknowns = ( customNames?.length ?? 0 ) >= 1;

  return (
    <Pane { ...params }>
      <PaneRoot>
        { expressionManager ? <>
          { presets.map( ( name ) => (
            <BlendShapeRow
              key={ name }
              name={ name }
              isAvailable={ expressionManager?.getExpression( name ) != null }
            />
          ) ) }
          <Hr />
          { customNames?.map( ( name ) => (
            <BlendShapeRow
              key={ name }
              name={ name }
              isAvailable={ true }
            />
          ) ) }
          { !hasUnknowns && <span className="text-gray-500">(No custom expressions)</span> }
        </> : 'No blendShapeProxy detected.' }
      </PaneRoot>
    </Pane>
  );
};
