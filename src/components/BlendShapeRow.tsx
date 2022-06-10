import { InspectorContext } from '../InspectorContext';
import { RangeRow } from './RangeRow';
import { useCallback, useContext } from 'react';

export const BlendShapeRow = ( { name, isAvailable }: {
  name: string;
  isAvailable: boolean;
} ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChange = useCallback(
    ( value: number ) => {
      inspector.model?.vrm?.expressionManager?.setValue( name, value );
    },
    []
  );

  return <RangeRow
    label={ name }
    disabled={ !isAvailable }
    onChange={ handleChange }
  />;
};
