import type React from 'react';
import { useCallback } from 'react';

export function HelpersPaneCheckbox({
  callback,
  label,
  checked,
}: {
  callback: (checked: boolean) => void;
  label: string;
  checked: boolean;
}) {
  const id = `HelpersPaneCheckbox_${label.replace(/\s+/g, '_')}`;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      callback(event.target.checked);
    },
    [callback],
  );

  return (
    <div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={id} className="ml-1">
        {label}
      </label>
    </div>
  );
}
