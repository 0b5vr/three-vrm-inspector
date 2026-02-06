import type React from 'react';
import { Link } from './Link';

export function NameValueEntry({
  name,
  value,
  href,
}: {
  name: string;
  value?: React.ReactNode;
  href?: string | undefined;
}) {
  return (
    <div>
      {name}: {value != null && <span className="font-bold">{value}</span>}
      {href && <Link href={href} />}
    </div>
  );
}
