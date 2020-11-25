import React, { useContext, useState } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const Bracket = styled.span<{ isHovering: boolean }>`
  color: ${ ( { isHovering } ) => ( isHovering ? Colors.accent : Colors.fore ) };
  user-select: none;
  cursor: pointer;
`;

const Children = styled.div`
  margin-left: 1.23em;
`;

const Entry = styled.div`
`;

const Value = styled.span`
`;

const NullValue = styled( Value )`
  color: ${ Colors.constant };
`;

const NumValue = styled( Value )`
  color: ${ Colors.number };
`;

const StrValue = styled( Value )`
  color: ${ Colors.string };
`;

const Root = styled.span`
  margin: 0;
  padding: 0;
  pointer-events: auto;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
`;


// == element ======================================================================================
export interface JSONValueProps {
  value: any;
  fullPath?: string;
}

export const JSONValue = ( { value, fullPath = '' }: JSONValueProps ): JSX.Element => {
  const { highlighter } = useContext( InspectorContext );
  const [ isOpen, setIsOpen ] = useState<boolean>( false );
  const [ isHovering, setIsHovering ] = useState<boolean>( false );
  const [ leaveCallback, setLeaveCallback ]
    = useState<[( () => void ) | undefined]>( [ undefined ] );

  const bracketProps = {
    onClick: () => setIsOpen( !isOpen ),
    onMouseEnter: () => {
      setIsHovering( true );
      setLeaveCallback( [ highlighter.highlight( fullPath ) ] );
    },
    onMouseLeave: () => {
      setIsHovering( false );
      leaveCallback[ 0 ] && leaveCallback[ 0 ]();
    },
    isHovering
  };

  const isArray = Array.isArray( value );
  const isNull = value == null;
  const isNumber = typeof value === 'number';
  const isString = typeof value === 'string';
  const isObject = !isArray && !isNull && !isNumber && !isString;

  return <>
    <Root>
      { isArray && <>
        <Bracket { ...bracketProps }>{ '[' }</Bracket>
        { isOpen && <Children>
          { value.map( ( e: any, i: number ) => (
            <Entry key={ i }>
              <JSONValue value={ e } fullPath={ `${ fullPath }/${ i }` } />
            </Entry>
          ) ) }
        </Children> }
        <Bracket { ...bracketProps }>{ ` ${isOpen ? '' : value.length } ]` }</Bracket>
      </> }

      { isObject && <>
        <Bracket { ...bracketProps }>{ '{' }</Bracket>
        { isOpen && <Children>
          { Object.keys( value ).map( ( key, i ) => (
            <Entry key={ i }>
              { key }: <JSONValue value={ value[ key ] } fullPath={ `${ fullPath }/${ key }` } />
            </Entry>
          ) ) }
        </Children> }
        <Bracket { ...bracketProps }>{ ` ${ isOpen ? '' : Object.keys( value ).join( ', ' ) } }` }</Bracket>
      </> }

      { isNull && <NullValue>{ value }</NullValue> }

      { isNumber && <NumValue>{ value }</NumValue> }

      { isString && <StrValue>&quot;{ value }&quot;</StrValue> }
    </Root>
  </>;
};
