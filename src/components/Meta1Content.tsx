import React from 'react';
import { VRM1Meta } from '@pixiv/three-vrm';
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
export const Meta1Content = ( { meta }: { meta: VRM1Meta } ): JSX.Element => {
  return <>
    <Line>Name:{ ' ' }
      <Value>{ meta.name }</Value>
    </Line>
    <Line>Version:{ ' ' }
      <Value>{ meta.version }</Value>
    </Line>
    <Line>Authors:{ ' ' }
      <Value>{ meta.authors.join( ', ' ) }</Value>
    </Line>
    <Line>Copyright Information:{ ' ' }
      <Value>{ meta.copyrightInformation }</Value>
    </Line>
    <Line>Contact Information:{ ' ' }
      <Value>{ meta.contactInformation }</Value>
    </Line>
    <Line>References:{ ' ' }
      <Value>{ meta.references?.join( ', ' ) }</Value>
    </Line>
    <Line>Third Party Licenses:{ ' ' }
      <Value>{ meta.thirdPartyLicenses }</Value>
    </Line>
    <Line>License URL:{ ' ' }
      <URLValue>{ meta.licenseUrl }</URLValue>
    </Line>
    <Line>Avatar Permission:{ ' ' }
      <Value>{ meta.avatarPermission }</Value>
    </Line>
    <Line>Allow Excessively Violent Usage:{ ' ' }
      <Value>{ String( meta.allowExcessivelyViolentUsage ) }</Value>
    </Line>
    <Line>Allow Excessively Sexual Usage:{ ' ' }
      <Value>{ String( meta.allowExcessivelySexualUsage ) }</Value>
    </Line>
    <Line>Commercial Usage Name:{ ' ' }
      <Value>{ meta.commercialUsage }</Value>
    </Line>
    <Line>Allow Political or Religious Usage:{ ' ' }
      <Value>{ String( meta.allowPoliticalOrReligiousUsage ) }</Value>
    </Line>
    <Line>Allow Antisocial or Hate Usage:{ ' ' }
      <Value>{ String( meta.allowAntisocialOrHateUsage ) }</Value>
    </Line>
    <Line>Credit Notation:{ ' ' }
      <Value>{ meta.creditNotation }</Value>
    </Line>
    <Line>Allow Redistribution:{ ' ' }
      <Value>{ String( meta.allowRedistribution ) }</Value>
    </Line>
    <Line>Modification:{ ' ' }
      <Value>{ meta.modification }</Value>
    </Line>
    <Line>Other License URL:{ ' ' }
      <URLValue>{ meta.otherLicenseUrl }</URLValue>
    </Line>
  </>;
};
