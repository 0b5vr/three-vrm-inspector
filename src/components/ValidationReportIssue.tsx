import React, { useCallback, useState } from 'react';
import { Colors } from '../constants/Colors';

// == microcomponents ==============================================================================
const Message: React.FC = ( { children } ) => (
  <div style={ { marginLeft: '1.13em' } }>{ children }</div>
);

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
    <div className="group cursor-pointer" onClick={ handleClick }>
      <span className="group-hover:text-sky-500">{ isOpening ? '- ' : '+ ' }</span>
      <span style={ { color } }>{ props.code }</span>
      <span className="text-gray-500">{ ' - ' + props.pointer }</span>
      { isOpening && <Message>{ props.message }</Message> }
    </div>
  );
};
