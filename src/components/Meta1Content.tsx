import React from 'react';
import { VRM1Meta } from '@pixiv/three-vrm';
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
      <Link href={ meta.licenseUrl } />
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
      <Link href={ meta.otherLicenseUrl } />
    </Line>
  </>;
};
