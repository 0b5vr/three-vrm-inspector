import React, { useCallback } from 'react';

export const CheckboxRow = ( { label, onChange, defaultChecked, disabled }: {
  label: string;
  onChange: ( value: boolean ) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
} ): JSX.Element => {
  const handleChange = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      const value = event.currentTarget.checked;
      onChange( value );
    },
    []
  );

  return (
    <div className="flex items-center">
      <input
        className="mr-2"
        type="checkbox"
        disabled={ disabled }
        defaultChecked={ defaultChecked }
        onChange={ handleChange }
      />
      { disabled
        ? <span className="text-gray-500">{ label }</span>
        : label
      }
    </div>
  );
};
