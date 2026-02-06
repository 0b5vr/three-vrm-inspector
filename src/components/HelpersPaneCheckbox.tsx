import React, { useCallback } from 'react';

export function HelpersPaneCheckbox({ callback, label, checked }: {
  callback: (checked: boolean) => void;
  label: string;
  checked: boolean;
}) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      callback(event.target.checked);
    },
    [callback],
  );

  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <label className="ml-1">
        { label }
      </label>
    </div>
  );
}
