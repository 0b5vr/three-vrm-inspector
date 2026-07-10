import { InspectorContext } from '../InspectorContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

// == hooks ========================================================================================
function useJSONValueHighlight(fullPath: string) {
  const { highlighter } = useContext(InspectorContext);
  const leaveCallbackRef = useRef<(() => void) | undefined>(undefined);
  const highlightTokenRef = useRef<number>(0);

  const cleanupHighlight = useCallback(
    () => {
      highlightTokenRef.current++;
      leaveCallbackRef.current?.();
      leaveCallbackRef.current = undefined;
    },
    [],
  );

  const highlight = useCallback(
    () => {
      cleanupHighlight();

      const token = ++highlightTokenRef.current;
      highlighter.highlight(fullPath).then((callback) => {
        if (highlightTokenRef.current === token) {
          leaveCallbackRef.current = callback;
        } else {
          callback?.();
        }
      });
    },
    [cleanupHighlight, highlighter, fullPath],
  );

  const clearHighlight = useCallback(
    () => {
      cleanupHighlight();
    },
    [cleanupHighlight],
  );

  useEffect(
    () => cleanupHighlight,
    [cleanupHighlight],
  );

  return {
    highlight,
    clearHighlight,
  };
}

// == microcomponents ==============================================================================
function Bracket({ children, onClick, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
}) {
  return (
    <span
      className="select-none cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      { children }
    </span>
  );
}

function Children({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginLeft: '1.13em' }}>{ children }</div>
  );
}

// == element ======================================================================================
export interface JSONValueProps {
  name?: string;
  value: any;
  fullPath?: string;
}

export function JSONValue({ name, value, fullPath = '' }: JSONValueProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const { highlight, clearHighlight } = useJSONValueHighlight(fullPath);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      setIsOpen(!isOpen);
    },
    [setIsOpen, isOpen],
  );

  const handleMouseEnter = useCallback(
    () => {
      setIsHovering(true);
      highlight();
    },
    [highlight],
  );

  const handleMouseLeave = useCallback(
    () => {
      setIsHovering(false);
      clearHighlight();
    },
    [clearHighlight],
  );

  const handleClickCopy = useCallback(
    () => {
      const text = JSON.stringify(value, null, 2);
      navigator.clipboard.writeText(text);
    },
    [value],
  );

  const isArray = Array.isArray(value);
  const isNull = value == null;
  const isNumber = typeof value === 'number';
  const isBoolean = typeof value === 'boolean';
  const isString = typeof value === 'string';
  const isObject = !isArray && !isNull && !isNumber && !isBoolean && !isString;

  const interactableProps = {
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <div className="select-auto group">
      <span
        className={`cursor-pointer ${isHovering && 'text-sky-500'}`}
        {...interactableProps}
      >
        { name ? `${name}: ` : '' }
      </span>

      { isArray && (
        <>
          <Bracket {...interactableProps}>[</Bracket>

          { isOpen && (
            <Children>
              { value.map((e: any, i: number) => (
                <div key={i}>
                  <JSONValue
                    name={i.toString() + (e?.name ? ` (${e.name})` : '')}
                    value={e}
                    fullPath={`${fullPath}/${i}`}
                  />
                </div>
              )) }
            </Children>
          ) }

          <Bracket {...interactableProps}>
            { ` ${isOpen ? '' : value.length} ]` }
          </Bracket>
        </>
      ) }

      { isObject && (
        <>
          <Bracket {...interactableProps}>{ '{' }</Bracket>

          { isOpen && (
            <Children>
              { Object.keys(value).map((key, i) => (
                <div key={i}>
                  <JSONValue
                    name={key}
                    value={value[key]}
                    fullPath={`${fullPath}/${key}`}
                  />
                </div>
              )) }
            </Children>
          ) }

          <Bracket {...interactableProps}>
            { ` ${isOpen ? '' : Object.keys(value).join(', ')} }` }
          </Bracket>
        </>
      ) }

      { isNull && (
        <>
          <span className="text-pink-500" {...interactableProps}>{ value }</span>
        </>
      ) }

      { isNumber && (
        <>
          <span className="text-indigo-400" {...interactableProps}>{ value }</span>
        </>
      ) }

      { isBoolean && (
        <>
          <span className="text-indigo-400" {...interactableProps}>{ String(value) }</span>
        </>
      ) }

      { isString && (
        <>
          <span className="text-yellow-300" {...interactableProps}>
            &quot;
            { value }
            &quot;
          </span>
        </>
      ) }

      <button
        className={`pl-1 ${isHovering ? 'opacity-40' : 'opacity-0'} hover:opacity-100`}
        {...interactableProps}
        onClick={handleClickCopy}
      >
        📋
      </button>
    </div>
  );
}
