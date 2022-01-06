import React from 'react';
import { VRM0Meta } from '@pixiv/three-vrm';
import styled from 'styled-components';
import { Link } from './Link';

// == styles =======================================================================================
const Value = styled.span`
  font-weight: bold;
`;

const Line = styled.div`
  line-height: 20px;
`;

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
      <Link href={ meta.otherPermissionUrl } />
    </Line>
    <Line>License Name:{ ' ' }
      <Value>{ meta.licenseName }</Value>
    </Line>
    <Line>Other License URL:{ ' ' }
      <Link href={ meta.otherLicenseUrl } />
    </Line>
  </>;
};
