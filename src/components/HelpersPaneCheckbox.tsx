import { useCallback, useState } from 'react';

export const HelpersPaneCheckbox = ( { callback, label, checked: checkedByDefault }: {
  callback: ( checked: boolean ) => void,
  label: string,
  checked?: boolean,
} ): JSX.Element => {
  const [ isChecked, setChecked ] = useState( checkedByDefault ?? false );

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
