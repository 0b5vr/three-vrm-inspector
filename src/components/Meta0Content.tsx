import { VRM0Meta } from '@pixiv/three-vrm';
import { NameValueEntry } from './NameValueEntry';

export const Meta0Content: React.FC<{ meta: VRM0Meta }> = ( { meta } ) => {
  return <>
    <NameValueEntry name="Title" value={ meta.title } />
    <NameValueEntry name="Author" value={ meta.author } />
    <NameValueEntry name="Version" value={ meta.version } />
    <NameValueEntry name="Reference" value={ meta.reference } />
    <NameValueEntry name="Contact Information" value={ meta.contactInformation } />
    <NameValueEntry name="Allowed User Name" value={ meta.allowedUserName } />
    <NameValueEntry name="Violent Ussage Name" value={ meta.violentUssageName } />
    <NameValueEntry name="Sexual Ussage Name" value={ meta.sexualUssageName } />
    <NameValueEntry name="Commercial Ussage Name" value={ meta.commercialUssageName } />
    <NameValueEntry name="Other Permission URL" href={ meta.otherPermissionUrl } />
    <NameValueEntry name="License Name" value={ meta.licenseName } />
    <NameValueEntry name="Other License URL" href={ meta.otherLicenseUrl } />
  </>;
};
