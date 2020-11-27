import React, { useCallback, useContext, useMemo } from 'react';
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
export const BlendShapeRow = ( { presetLabel, name }: {
  presetLabel?: string;
  name?: string;
} ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const isCustom = presetLabel == null;
  const isLegit = name != null;

  const label = useMemo(
    () => (
      isCustom
        ? name!
        : isLegit
          ? `${ presetLabel } (${ name })`
          : <TextDisabled>{ presetLabel }</TextDisabled>
    ),
    [ presetLabel, name ]
  );

  const handleChange = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      inspector.vrm?.blendShapeProxy?.setValue( name!, parseFloat( event.target.value ) );
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
        disabled={ !isLegit }
        onChange={ handleChange }
      />
      { label }
    </Root>
  );
};
