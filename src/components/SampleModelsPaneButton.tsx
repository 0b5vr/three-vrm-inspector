import React, { useCallback, useContext } from 'react';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const Button = styled.button`
  display: block;
`;

// == element ======================================================================================
export const SampleModelsPaneButton = ( { name, url }: {
  name: string;
  url: string;
} ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const load = useCallback( () => {
    inspector.loadVRM( url );
  }, [ inspector ] );

  return <Button value={ name } onClick={ load }>{ name }</Button>;
};
