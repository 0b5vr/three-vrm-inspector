import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const Input = styled.input`
  margin-right: 8px;
`;

const TextDisabled = styled.span`
  color: ${ Colors.gray };
`;

const Root = styled.div`
  display: flex;
  align-items: center;
`;

// == element ======================================================================================
export const BlendShapeRow = ( { name, isAvailable }: {
  name: string;
  isAvailable: boolean;
} ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChange = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      inspector.vrm?.expressionManager?.setValue( name, parseFloat( event.target.value ) );
    },
    []
  );

  return (
    <Root>
      <Input
        type="range"
        min="0"
        max="1"
        step="0.001"
        defaultValue="0"
        disabled={ !isAvailable }
        onChange={ handleChange }
      />
      { isAvailable ? name : <TextDisabled>{ name }</TextDisabled> }
    </Root>
  );
};
