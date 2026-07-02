import React, { useCallback } from 'react';

export function RangeRow({ label, onChange, defaultValue, value, disabled }: {
  label: string;
  onChange: (value: number) => void;
  defaultValue?: number;
  value?: number;
  disabled?: boolean;
}) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.currentTarget.value);
      onChange(value);
    },
    [],
  );

  return (
    <div className="flex items-center">
      <input
        className="mr-2"
        type="range"
        min="0"
        max="1"
        step="0.001"
        {...(value == null
          ? { defaultValue: defaultValue ?? 0.0 }
          : { value })}
        disabled={disabled}
        onChange={handleChange}
      />
      { disabled
        ? <span className="text-gray-500">{ label }</span>
        : label}
    </div>
  );
}
