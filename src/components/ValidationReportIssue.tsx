import React, { useCallback, useState } from 'react';
import { Colors } from '../constants/Colors';
import styled from 'styled-components';

// == styles =======================================================================================
const Plus = styled.span`
`;

const Code = styled.span`
`;

const Pointer = styled.span`
  color: ${ Colors.gray };
`;

const Message = styled.div`
  margin-left: 1.13em;
`;

const Root = styled.div`
  font-family: 'Roboto Mono', monospace;
  cursor: pointer;

  &:hover ${ Plus } {
    color: ${ Colors.accent };
  }
`;

// == element ======================================================================================
export const ValidationReportIssue = ( props: {
  code: string;
  message: string;
  severity: number;
  pointer?: string;
} ): JSX.Element => {
  const [ isOpening, setOpening ] = useState( false );

  const color = props.severity === 0
    ? Colors.error
    : props.severity === 1
      ? Colors.warning
      : Colors.severityInfo;

  const handleClick = useCallback(
    () => {
      setOpening( !isOpening );
    },
    [ isOpening ]
  );

  return (
    <Root onClick={ handleClick }>
      <Plus>{ isOpening ? '- ' : '+ ' }</Plus>
      <Code style={ { color } }>{ props.code }</Code>
      <Pointer>{ ' - ' + props.pointer }</Pointer>
      { isOpening && <Message>{ props.message }</Message> }
    </Root>
  );
};
