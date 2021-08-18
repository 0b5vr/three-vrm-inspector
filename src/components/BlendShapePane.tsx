import { Pane, PaneParams } from './Pane';
import React, { useContext } from 'react';
import { BlendShapeRow } from './BlendShapeRow';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { VRMExpressionPresetName } from '@pixiv/three-vrm';
import styled from 'styled-components';

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

// == styles =======================================================================================
const Hr = styled.div`
  width: 100%;
  height: 2px;
  margin: 8px 0;
  background: ${ Colors.gray };
`;

const TextNoCustomFound = styled.div`
  color: ${ Colors.gray };
`;

const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

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
      <Root>
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
          { !hasUnknowns && <TextNoCustomFound>(No custom expressions)</TextNoCustomFound> }
        </> : 'No blendShapeProxy detected.' }
      </Root>
    </Pane>
  );
};
