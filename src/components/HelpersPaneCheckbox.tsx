import { useCallback } from 'react';

export const HelpersPaneCheckbox = ( { callback, label, checked }: {
  callback: ( checked: boolean ) => void,
  label: string,
  checked: boolean,
} ): JSX.Element => {
  const handleChange = useCallback( ( { target } ) => {
    callback( target.checked );
  }, [ callback ] );

  return (
    <div>
      <input
        type="checkbox"
        checked={ checked }
        onChange={ handleChange }
      />
      <label className="ml-1">
        { label }
      </label>
    </div>
  );
};
