import React, { useCallback } from 'react';

export const RangeRow = ( { label, onChange, defaultValue, disabled }: {
  label: string;
  onChange: ( value: number ) => void;
  defaultValue?: number;
  disabled?: boolean;
} ): JSX.Element => {
  const handleChange = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      const value = parseFloat( event.currentTarget.value );
      onChange( value );
    },
    []
  );

  return (
    <div className="flex items-center">
      <input
        className="mr-2"
        type="range"
        min="0"
        max="1"
        step="0.001"
        defaultValue={ defaultValue ?? 0.0 }
        disabled={ disabled }
        onChange={ handleChange }
      />
      { disabled
        ? <span className="text-gray-500">{ label }</span>
        : label
      }
    </div>
  );
};
