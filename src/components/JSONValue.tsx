import React, { useCallback, useContext, useState } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import styled from 'styled-components';

// == styles =======================================================================================
const Bracket = styled.span`
  user-select: none;
  cursor: pointer;
`;

const Children = styled.div`
  margin-left: 1.13em;
`;

const Name = styled.span<{ isHovering: boolean }>`
  color: ${ ( { isHovering } ) => ( isHovering ? Colors.accent : Colors.fore ) };
  cursor: pointer;
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
`;


// == element ======================================================================================
export interface JSONValueProps {
  name?: string;
  value: any;
  fullPath?: string;
}

export const JSONValue = ( { name, value, fullPath = '' }: JSONValueProps ): JSX.Element => {
  const { highlighter } = useContext( InspectorContext );
  const [ isOpen, setIsOpen ] = useState<boolean>( false );
  const [ isHovering, setIsHovering ] = useState<boolean>( false );
  const [ leaveCallback, setLeaveCallback ]
    = useState<[( () => void ) | undefined]>( [ undefined ] );

  const handleClick = useCallback(
    ( event: React.MouseEvent ) => {
      event.stopPropagation();

      setIsOpen( !isOpen );
    },
    [ setIsOpen, isOpen ]
  );

  const handleMouseEnter = useCallback(
    () => {
      setIsHovering( true );
      setLeaveCallback( [ highlighter.highlight( fullPath ) ] );
    },
    [ setIsHovering, setLeaveCallback, highlighter, fullPath ]
  );

  const handleMouseLeave = useCallback(
    () => {
      setIsHovering( false );
      leaveCallback[ 0 ]?.();
    },
    [ setIsHovering, leaveCallback ]
  );

  const isArray = Array.isArray( value );
  const isNull = value == null;
  const isNumber = typeof value === 'number';
  const isString = typeof value === 'string';
  const isObject = !isArray && !isNull && !isNumber && !isString;

  const interactableProps = {
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    isHovering: isHovering,
  };

  return <>
    <Root>
      <Name { ...interactableProps }>
        { name ? `${ name }: ` : '' }
      </Name>

      { isArray && <>
        <Bracket { ...interactableProps }>{ '[' }</Bracket>

        { isOpen && <Children>
          { value.map( ( e: any, i: number ) => (
            <Entry key={ i }>
              <JSONValue
                name={ i.toString() + ( e?.name ? ` (${ e.name })` : '' ) }
                value={ e }
                fullPath={ `${ fullPath }/${ i }` }
              />
            </Entry>
          ) ) }
        </Children> }

        <Bracket { ...interactableProps }>
          { ` ${isOpen ? '' : value.length } ]` }
        </Bracket>
      </> }

      { isObject && <>
        <Bracket { ...interactableProps }>{ '{' }</Bracket>

        { isOpen && <Children>
          { Object.keys( value ).map( ( key, i ) => (
            <Entry key={ i }>
              <JSONValue
                name={ key }
                value={ value[ key ] }
                fullPath={ `${ fullPath }/${ key }` }
              />
            </Entry>
          ) ) }
        </Children> }

        <Bracket { ...interactableProps }>
          { ` ${ isOpen ? '' : Object.keys( value ).join( ', ' ) } }` }
        </Bracket>
      </> }

      { isNull && <>
        <NullValue { ...interactableProps }>{ value }</NullValue>
      </> }

      { isNumber && <>
        <NumValue { ...interactableProps }>{ value }</NumValue>
      </> }

      { isString && <>
        <StrValue { ...interactableProps }>&quot;{ value }&quot;</StrValue>
      </> }
    </Root>
  </>;
};
