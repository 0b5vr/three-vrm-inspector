import React from 'react';
import styled from 'styled-components';
import { Colors } from '../constants/Colors';

// == styles =======================================================================================
const Anchor = styled.a`
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  color: ${ Colors.accent };
  vertical-align: top;
  font-weight: bold;
`;

// == component ====================================================================================
export const Link = ( { href }: { href?: string } ): JSX.Element | null => {
  if ( href == null ) { return null; }

  return <Anchor href={ href } target="_blank" rel="noreferrer">{ href }</Anchor>;
};
