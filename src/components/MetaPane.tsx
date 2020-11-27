import { Pane, PaneParams } from './Pane';
import React, { useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const URLValueStyle = styled.a`
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  color: #53c5ff;
  vertical-align: top;
  font-weight: bold;
`;

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

// == microcomponents ==============================================================================
const URLValue = ( { children }: {
  children: string | undefined;
} ): JSX.Element | null => {
  if ( children == null ) {
    return null;
  }

  return (
    <URLValueStyle
      href={ children }
      target="_blank"
      rel="noreferrer noreferrer"
    >
      { children }
    </URLValueStyle>
  );
};

// == element ======================================================================================
export const MetaPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  return (
    <Pane { ...params }>
      <Root>
        <Line>Title:{ ' ' }
          <Value>{ inspector.vrm?.meta?.title }</Value>
        </Line>
        <Line>Author:{ ' ' }
          <Value>{ inspector.vrm?.meta?.author }</Value>
        </Line>
        <Line>Version:{ ' ' }
          <Value>{ inspector.vrm?.meta?.version }</Value>
        </Line>
        <Line>Reference:{ ' ' }
          <Value>{ inspector.vrm?.meta?.reference }</Value>
        </Line>
        <Line>Contact Information:{ ' ' }
          <Value>{ inspector.vrm?.meta?.contactInformation }</Value>
        </Line>
        <Line>Allowed User Name:{ ' ' }
          <Value>{ inspector.vrm?.meta?.allowedUserName }</Value>
        </Line>
        <Line>Violent Ussage Name:{ ' ' }
          <Value>{ inspector.vrm?.meta?.violentUssageName }</Value>
        </Line>
        <Line>Sexual Ussage Name:{ ' ' }
          <Value>{ inspector.vrm?.meta?.sexualUssageName }</Value>
        </Line>
        <Line>Commercial Ussage Name:{ ' ' }
          <Value>{ inspector.vrm?.meta?.commercialUssageName }</Value>
        </Line>
        <Line>Other Permission URL:{ ' ' }
          <URLValue>{ inspector.vrm?.meta?.otherPermissionUrl }</URLValue>
        </Line>
        <Line>License Name:{ ' ' }
          <Value>{ inspector.vrm?.meta?.licenseName }</Value>
        </Line>
        <Line>Other License URL:{ ' ' }
          <URLValue>{ inspector.vrm?.meta?.otherLicenseUrl }</URLValue>
        </Line>
      </Root>
    </Pane>
  );
};
