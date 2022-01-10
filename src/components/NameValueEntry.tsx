import { Link } from './Link';
import React from 'react';

export const NameValueEntry: React.FC<{
  name: string;
  value?: React.ReactNode;
  href?: string | undefined;
}> = ( { name, value, href } ) => (
  <div>{ name }:{ ' ' }
    { value != null && <span className="font-bold">{ value }</span> }
    { href && <Link href={ href } /> }
  </div>
);
