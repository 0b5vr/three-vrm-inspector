import React from 'react';
import { Link } from './Link';

export const NameValueEntry: React.FC<{
  name: string;
  value?: React.ReactNode;
  href?: string | undefined;
}> = ( { name, value, href } ) => (
  <div>{ name }:{ ' ' }
    { value && <span className="font-bold">{ value }</span> }
    { href && <Link href={ href } /> }
  </div>
);
