export function Link({ href, widthClass }: {
  href?: string;
  widthClass?: string;
}) {
  if (href == null) { return null; }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`font-bold truncate inline-block align-top underline text-sky-500 ${widthClass ?? 'w-64'}`}
    >
      { href }
    </a>
  );
}
