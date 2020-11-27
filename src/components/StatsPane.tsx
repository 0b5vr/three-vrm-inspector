import { Pane, PaneParams } from './Pane';
import React, { useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const Value = styled.span`
  font-weight: bold;
`;

const Line = styled.div`
  line-height: 20px;
`;

const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == element ======================================================================================
export const StatsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  return (
    <Pane { ...params }>
      <Root>
        <Line>Dimension:{ ' ' }
          <Value>( { inspector.stats?.dimension[ 0 ].toFixed( 3 ) }, { inspector.stats?.dimension[ 1 ].toFixed( 3 ) }, { inspector.stats?.dimension[ 2 ].toFixed( 3 ) } )</Value>
        </Line>
        <Line>Vertices:{ ' ' }
          <Value>{ inspector.stats?.vertices }</Value>
        </Line>
        <Line>Polygons:{ ' ' }
          <Value>{ inspector.stats?.polygons }</Value>
        </Line>
        <Line>Meshes:{ ' ' }
          <Value>{ inspector.stats?.meshes }</Value>
        </Line>
        <Line>Primitives:{ ' ' }
          <Value>{ inspector.stats?.primitives }</Value>
        </Line>
        <Line>Materials:{ ' ' }
          <Value>{ inspector.stats?.materials }</Value>
        </Line>
        <Line>Spring Bones:{ ' ' }
          <Value>{ inspector.stats?.springBones }</Value>
        </Line>
      </Root>
    </Pane>
  );
};
