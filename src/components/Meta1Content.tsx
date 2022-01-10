import { VRM1Meta } from '@pixiv/three-vrm';
import { NameValueEntry } from './NameValueEntry';

// == element ======================================================================================
export const Meta1Content: React.FC<{ meta: VRM1Meta }> = ( { meta } ) => {
  return <>
    <NameValueEntry name="Name" value={ meta.name } />
    <NameValueEntry name="Version" value={ meta.version } />
    <NameValueEntry name="Authors" value={ meta.authors.join( ', ' ) } />
    <NameValueEntry name="Copyright Information" value={ meta.copyrightInformation } />
    <NameValueEntry name="Contact Information" value={ meta.contactInformation } />
    <NameValueEntry name="References" value={ meta.references?.join( ', ' ) } />
    <NameValueEntry name="Third Party Licenses" value={ meta.thirdPartyLicenses } />
    <NameValueEntry name="License URL" href={ meta.licenseUrl } />
    <NameValueEntry name="Avatar Permission" value={ meta.avatarPermission } />
    <NameValueEntry name="Allow Excessively Violent Usage" value={ String( meta.allowExcessivelyViolentUsage ) } />
    <NameValueEntry name="Allow Excessively Sexual Usage" value={ String( meta.allowExcessivelySexualUsage ) } />
    <NameValueEntry name="Commercial Usage Name" value={ meta.commercialUsage } />
    <NameValueEntry name="Allow Political or Religious Usage" value={ String( meta.allowPoliticalOrReligiousUsage ) } />
    <NameValueEntry name="Allow Antisocial or Hate Usage" value={ String( meta.allowAntisocialOrHateUsage ) } />
    <NameValueEntry name="Credit Notation" value={ meta.creditNotation } />
    <NameValueEntry name="Allow Redistribution" value={ String( meta.allowRedistribution ) } />
    <NameValueEntry name="Modification" value={ meta.modification } />
    <NameValueEntry name="Other License URL" href={ meta.otherLicenseUrl } />
  </>;
};
