import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

// == styles =======================================================================================
const Checkbox = styled.input`
`;

const Line = styled.div`
  line-height: 20px;
`;

// == element ======================================================================================
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
    <Line>
      <Checkbox
        type="checkbox"
        checked={ isChecked }
        onChange={ handleChange }
      />
      { label }
    </Line>
  );
};
