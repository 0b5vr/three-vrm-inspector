export const PaneRoot: React.FC<{
  className?: string;
  paddingClass?: string;
}> = ( { className, paddingClass, children } ) => (
  <div className={ `bg-gray-900/80 backdrop-blur ${ paddingClass ?? 'p-2' } ${ className }` }>
    { children }
  </div>
);
