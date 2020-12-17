import { Pane, PaneParams } from './Pane';
import React, { useContext } from 'react';
import { BlendShapeRow } from './BlendShapeRow';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { VRMSchema } from '@pixiv/three-vrm';
import styled from 'styled-components';

// == constants ====================================================================================
const blendShapePresets: Array<[ VRMSchema.BlendShapePresetName, string ]> = [
  [ VRMSchema.BlendShapePresetName.Neutral, 'Neutral' ],
  [ VRMSchema.BlendShapePresetName.Joy, 'Joy' ],
  [ VRMSchema.BlendShapePresetName.Angry, 'Angry' ],
  [ VRMSchema.BlendShapePresetName.Sorrow, 'Sorrow' ],
  [ VRMSchema.BlendShapePresetName.Fun, 'Fun' ],
  [ VRMSchema.BlendShapePresetName.A, 'A' ],
  [ VRMSchema.BlendShapePresetName.E, 'E' ],
  [ VRMSchema.BlendShapePresetName.I, 'I' ],
  [ VRMSchema.BlendShapePresetName.O, 'O' ],
  [ VRMSchema.BlendShapePresetName.U, 'U' ],
  [ VRMSchema.BlendShapePresetName.Lookleft, 'Look Left' ],
  [ VRMSchema.BlendShapePresetName.Lookright, 'Look Right' ],
  [ VRMSchema.BlendShapePresetName.Lookdown, 'Look Down' ],
  [ VRMSchema.BlendShapePresetName.Lookup, 'Look Up' ],
];

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

  const proxy = inspector.vrm?.blendShapeProxy;

  const presetMap = proxy?.blendShapePresetMap;
  const unknowns = proxy?.unknownGroupNames;
  const hasUnknowns = ( unknowns?.length ?? 0 ) >= 1;

  return (
    <Pane { ...params }>
      <Root>
        { proxy ? <>
          { blendShapePresets.map( ( [ preset, label ] ) => (
            <BlendShapeRow
              key={ preset }
              presetLabel={ label }
              name={ presetMap?.[ preset ] }
            />
          ) ) }
          <Hr />
          { unknowns?.map( ( name ) => (
            <BlendShapeRow
              key={ name }
              name={ name }
            />
          ) ) }
          { !hasUnknowns && <TextNoCustomFound>(No custom expressions)</TextNoCustomFound> }
        </> : 'No blendShapeProxy detected.' }
      </Root>
    </Pane>
  );
};
