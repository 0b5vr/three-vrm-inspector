import React, { useCallback, useState } from 'react';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';
import { useDoubleClick } from '../utils/useDoubleClick';

// == styles =======================================================================================
const ButtonExpand = styled.span`
  display: inline-block;
  width: ${ Metrics.titleBarHeight };
  height: ${ Metrics.titleBarHeight };
  text-align: center;
  cursor: pointer;

  &:hover {
    color: ${ Colors.accent };
  }
`;

const TitleBar = styled.div`
  height: ${ Metrics.titleBarHeight };
  line-height: ${ Metrics.titleBarHeight };
  width: 100%;
  background: ${ Colors.titleBarBg };
  cursor: move;
`;

const Root = styled.div`
  position: absolute;
  min-width: 240px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 1.0);
`;

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
const Pane = ( params: PaneParams ): JSX.Element => {
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
    <Root
      style={{
        left: position.left,
        top: position.top,
      }}
      className={ params.className }
      onMouseDown={ handleMouseDown }
    >
      <TitleBar
        onMouseDown={ handleMouseDownTitleBar }
      >
        <ButtonExpand
          onMouseDown={ handleMouseDownExpand }
        >
          { isOpening ? '-' : '+' }
        </ButtonExpand>
        { params.title }
      </TitleBar>
      { isOpening && ( params.children ?? null ) }
    </Root>
  );
};

export { Pane };
