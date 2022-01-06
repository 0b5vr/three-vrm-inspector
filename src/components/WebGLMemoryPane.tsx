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

const Hr = styled.div`
  width: 100%;
  height: 2px;
  margin: 8px 0;
  background: ${ Colors.gray };
`;

const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == functions ====================================================================================
const bytesToDisplayBytes = ( bytes: number ): string => {
  return ( bytes / 1048576.0 ).toFixed( 3 ) + ' MB';
};

// == element ======================================================================================
export const WebGLMemoryPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const info = inspector.webglMemoryInfo;

  return (
    <Pane { ...params }>
      <Root>
        <Line>Buffer:{ ' ' }
          <Value>{ bytesToDisplayBytes( info?.memory?.buffer ?? 0.0 ) }</Value>
        </Line>
        <Line>Texture:{ ' ' }
          <Value>{ bytesToDisplayBytes( info?.memory?.texture ?? 0.0 ) }</Value>
        </Line>
        <Line>Render Buffer:{ ' ' }
          <Value>{ bytesToDisplayBytes( info?.memory?.renderbuffer ?? 0.0 ) }</Value>
        </Line>
        <Line>Drawing Buffer:{ ' ' }
          <Value>{ bytesToDisplayBytes( info?.memory?.drawingbuffer ?? 0.0 ) }</Value>
        </Line>
        <Line>Total:{ ' ' }
          <Value>{ bytesToDisplayBytes( info?.memory?.total ?? 0.0 ) }</Value>
        </Line>
        <Hr />
        <Line>Buffer:{ ' ' }
          <Value>{ info?.resources?.buffer ?? 0 }</Value>
        </Line>
        <Line>Render Buffer:{ ' ' }
          <Value>{ info?.resources?.renderbuffer ?? 0 }</Value>
        </Line>
        <Line>Program:{ ' ' }
          <Value>{ info?.resources?.program ?? 0 }</Value>
        </Line>
        <Line>Query:{ ' ' }
          <Value>{ info?.resources?.query ?? 0 }</Value>
        </Line>
        <Line>Sampler:{ ' ' }
          <Value>{ info?.resources?.sampler ?? 0 }</Value>
        </Line>
        <Line>Shader:{ ' ' }
          <Value>{ info?.resources?.shader ?? 0 }</Value>
        </Line>
        <Line>Sync:{ ' ' }
          <Value>{ info?.resources?.sync ?? 0 }</Value>
        </Line>
        <Line>Texture:{ ' ' }
          <Value>{ info?.resources?.texture ?? 0 }</Value>
        </Line>
        <Line>Transform Feedback:{ ' ' }
          <Value>{ info?.resources?.transformFeedback ?? 0 }</Value>
        </Line>
        <Line>Vertex Array:{ ' ' }
          <Value>{ info?.resources?.vertexArray ?? 0 }</Value>
        </Line>
      </Root>
    </Pane>
  );
};
