import { App } from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

const uiContainer = document.createElement( 'div' );
document.body.appendChild( uiContainer );

ReactDOM.render(
  <App />,
  uiContainer
);
