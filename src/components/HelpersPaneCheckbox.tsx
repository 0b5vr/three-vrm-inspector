import { useCallback, useState } from 'react';

export const HelpersPaneCheckbox = ( { callback, label }: {
  callback: ( checked: boolean ) => void,
  label: string,
} ): JSX.Element => {
  const [ isChecked, setChecked ] = useState( true );

  const handleChange = useCallback( ( { target } ) => {
    callback( target.checked );
    setChecked( target.checked );
  }, [ callback ] );

  return (
    <div>
      <input
        type="checkbox"
        checked={ isChecked }
        onChange={ handleChange }
      />
      { label }
    </div>
  );
};
