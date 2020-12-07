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

  const dim = inspector.stats?.dimension.map( ( v ) => v.toFixed( 3 ) );

  return (
    <Pane { ...params }>
      <Root>
        <Line>Dimension:{ ' ' }
          <Value>( { dim?.[ 0 ] ?? 0.0 }, { dim?.[ 1 ] ?? 0.0 }, { dim?.[ 2 ] ?? 0.0 } )</Value>
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
