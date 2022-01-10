import { registerMouseEvent } from '../utils/registerMouseEvent';
import { useCallback, useState } from 'react';
import { useDoubleClick } from '../utils/useDoubleClick';

// == params =======================================================================================
export interface PaneParams {
  title: string;
  initPosition?: { left: number; top: number };
  initOpening?: boolean;
  children?: React.ReactNode;
  paneKey: string;
  onClick: ( event: React.MouseEvent, paneKey: string ) => void;
  className?: string;
}

// == element ======================================================================================
const Pane: React.FC<PaneParams> = ( params ) => {
  const [ position, setPosition ] = useState( params.initPosition ?? {
    left: 0,
    top: 0,
  } );
  const [ isOpening, setOpening ] = useState( params.initOpening ?? false );
  const whenDoubleClick = useDoubleClick();

  const handleMouseDown = useCallback(
    ( event: React.MouseEvent ) => {
      params.onClick?.( event, params.paneKey );
    },
    [ params.onClick, params.paneKey ]
  );

  const handleMouseDownTitleBar = useCallback(
    ( event: React.MouseEvent ) => {
      event.preventDefault();

      let left = position.left;
      let top = position.top;

      registerMouseEvent(
        ( event, movementSum ) => {
          event.preventDefault();
          event.stopPropagation();

          left += movementSum.x;
          top += movementSum.y;

          setPosition( { left, top } );
        },
      );

      whenDoubleClick( () => {
        setOpening( !isOpening );
      } );
    },
    [ isOpening, position ]
  );

  const handleMouseDownExpand = useCallback(
    ( event: React.MouseEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      params.onClick?.( event, params.paneKey );
      setOpening( !isOpening );
    },
    [ isOpening, params.onClick, params.paneKey ]
  );

  return (
    <div
      style={{
        left: position.left,
        top: position.top,
        minWidth: '15rem',
        boxShadow: '0 0 10px rgba(0, 0, 0, 1.0)'
      }}
      className={ `absolute shadow ${ params.className }` }
      onMouseDown={ handleMouseDown }
    >
      <div // title bar
        className="h-5 leading-5 w-full bg-gray-700 cursor-move"
        onMouseDown={ handleMouseDownTitleBar }
      >
        <div // plus
          className="inline-block w-5 h-5 text-center cursor-pointer hover:text-sky-500"
          onMouseDown={ handleMouseDownExpand }
        >
          { isOpening ? '-' : '+' }
        </div>
        { params.title }
      </div>
      { isOpening && ( params.children ?? null ) }
    </div>
  );
};

export { Pane };
