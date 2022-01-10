import React, { useCallback, useContext, useState } from 'react';
import { InspectorContext } from '../InspectorContext';

// == microcomponents ==============================================================================
const Bracket: React.FC<{
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
}> = ( { children, onClick, onMouseEnter, onMouseLeave } ) => (
  <span
    className="select-none cursor-pointer"
    onClick={ onClick }
    onMouseEnter={ onMouseEnter }
    onMouseLeave={ onMouseLeave }
  >{ children }</span>
);

const Children: React.FC = ( { children } ) => (
  <div style={ { marginLeft: '1.13em' } }>{ children }</div>
);

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
  const isBoolean = typeof value === 'boolean';
  const isString = typeof value === 'string';
  const isObject = !isArray && !isNull && !isNumber && !isBoolean && !isString;

  const interactableProps = {
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    isHovering: isHovering,
  };

  return (
    <div className="select-auto">
      <span
        className={ `cursor-pointer ${ isHovering && 'text-sky-500' }` }
        { ...interactableProps }
      >
        { name ? `${ name }: ` : '' }
      </span>

      { isArray && <>
        <Bracket { ...interactableProps }>{ '[' }</Bracket>

        { isOpen && <Children>
          { value.map( ( e: any, i: number ) => (
            <div key={ i }>
              <JSONValue
                name={ i.toString() + ( e?.name ? ` (${ e.name })` : '' ) }
                value={ e }
                fullPath={ `${ fullPath }/${ i }` }
              />
            </div>
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
            <div key={ i }>
              <JSONValue
                name={ key }
                value={ value[ key ] }
                fullPath={ `${ fullPath }/${ key }` }
              />
            </div>
          ) ) }
        </Children> }

        <Bracket { ...interactableProps }>
          { ` ${ isOpen ? '' : Object.keys( value ).join( ', ' ) } }` }
        </Bracket>
      </> }

      { isNull && <>
        <span className="text-pink-500" { ...interactableProps }>{ value }</span>
      </> }

      { isNumber && <>
        <span className="text-indigo-400" { ...interactableProps }>{ value }</span>
      </> }

      { isBoolean && <>
        <span className="text-indigo-400" { ...interactableProps }>{ String( value ) }</span>
      </> }

      { isString && <>
        <span className="text-yellow-300" { ...interactableProps }>&quot;{ value }&quot;</span>
      </> }
    </div>
  );
};
