/* eslint-disable react/jsx-key */

import React, { useCallback, useState } from 'react';
import { JSONPane } from './JSONPane';
import { MaterialDebuggerPane } from './MaterialDebuggerPane';
import { MetaPane } from './MetaPane';

// == element ======================================================================================
const PaneList = (): JSX.Element => {
  const [ order, setOrder ] = useState( [
    'jsonTree',
    'materialDebugger',
    'meta',
  ] );

  const handleClick = useCallback(
    ( event: React.MouseEvent, paneKey: string ) => {
      const newOrder = order.concat();
      newOrder.splice( order.indexOf( paneKey ), 1 );
      newOrder.push( paneKey );

      setOrder( newOrder );
    },
    [ order ]
  );

  const panes: { [ key: string ]: JSX.Element } = {
    'jsonTree': <JSONPane
      key="jsonTree"
      paneKey="jsonTree"
      title="JSON Tree"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 0 } }
    />,
    'materialDebugger': <MaterialDebuggerPane
      key="materialDebugger"
      paneKey="materialDebugger"
      title="Material Debugger"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 20 } }
    />,
    'meta': <MetaPane
      key="meta"
      paneKey="meta"
      title="Meta"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 40 } }
    />,
  };

  return <>
    { order.map( ( paneKey ) => panes[ paneKey ] ) }
  </>;
};

export { PaneList };
