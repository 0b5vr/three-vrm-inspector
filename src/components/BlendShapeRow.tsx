import { InspectorContext } from '../InspectorContext';
import React, { useCallback, useContext } from 'react';

export const BlendShapeRow = ( { name, isAvailable }: {
  name: string;
  isAvailable: boolean;
} ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChange = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      inspector.model?.vrm?.expressionManager?.setValue( name, parseFloat( event.target.value ) );
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
        defaultValue="0"
        disabled={ !isAvailable }
        onChange={ handleChange }
      />
      { isAvailable
        ? name
        : <span className="text-gray-500">{ name }</span>
      }
    </div>
  );
};
