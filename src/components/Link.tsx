import React from 'react';

// == component ====================================================================================
export const Link: React.FC<{
  href?: string;
  widthClass?: string;
}> = ( { href, widthClass } ) => {
  if ( href == null ) { return null; }

  return <a
    href={ href }
    target="_blank"
    rel="noreferrer"
    className={ `font-bold truncate inline-block align-top underline text-sky-500 ${ widthClass ?? 'w-64' }` }
  >
    { href }
  </a>;
};
