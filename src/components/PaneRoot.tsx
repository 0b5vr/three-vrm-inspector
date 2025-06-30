import React from 'react';

export const PaneRoot = ({ className, paddingClass, children }: {
  className?: string;
  paddingClass?: string;
  children?: React.ReactNode;
}) => (
  <div className={`bg-gray-900/80 backdrop-blur ${paddingClass ?? 'p-2'} ${className}`}>
    { children }
  </div>
);
