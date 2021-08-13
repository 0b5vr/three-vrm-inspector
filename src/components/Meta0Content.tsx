import React from 'react';
import { VRM0Meta } from '@pixiv/three-vrm';
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
export const Meta0Content = ( { meta }: { meta: VRM0Meta } ): JSX.Element => {
  return <>
    <Line>Title:{ ' ' }
      <Value>{ meta.title }</Value>
    </Line>
    <Line>Author:{ ' ' }
      <Value>{ meta.author }</Value>
    </Line>
    <Line>Version:{ ' ' }
      <Value>{ meta.version }</Value>
    </Line>
    <Line>Reference:{ ' ' }
      <Value>{ meta.reference }</Value>
    </Line>
    <Line>Contact Information:{ ' ' }
      <Value>{ meta.contactInformation }</Value>
    </Line>
    <Line>Allowed User Name:{ ' ' }
      <Value>{ meta.allowedUserName }</Value>
    </Line>
    <Line>Violent Ussage Name:{ ' ' }
      <Value>{ meta.violentUssageName }</Value>
    </Line>
    <Line>Sexual Ussage Name:{ ' ' }
      <Value>{ meta.sexualUssageName }</Value>
    </Line>
    <Line>Commercial Ussage Name:{ ' ' }
      <Value>{ meta.commercialUssageName }</Value>
    </Line>
    <Line>Other Permission URL:{ ' ' }
      <URLValue>{ meta.otherPermissionUrl }</URLValue>
    </Line>
    <Line>License Name:{ ' ' }
      <Value>{ meta.licenseName }</Value>
    </Line>
    <Line>Other License URL:{ ' ' }
      <URLValue>{ meta.otherLicenseUrl }</URLValue>
    </Line>
  </>;
};
