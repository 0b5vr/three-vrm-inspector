import * as THREE from 'three';
import { App } from './components/App';
import { Inspector } from './Inspector';
import React from 'react';
import ReactDOM from 'react-dom';
import { VRM } from '@pixiv/three-vrm';

const uiContainer = document.createElement( 'div' );
document.body.appendChild( uiContainer );

let progress: ProgressEvent | null = null;
function handleProgress( p: ProgressEvent ): void {
  progress = p;
}

function handleLoad( vrm: VRM ): void {
  progress = null;
  console.info( vrm );
}

function handleError( error: any ): void {
  console.error( error );
}

const inspector: Inspector = new Inspector();
inspector.loadVRM( './models/three-vrm-girl.vrm', handleProgress )
  .then( handleLoad ).catch( handleError );
inspector.registerDnD( document.body, handleLoad, handleProgress, handleError );

function handleCanvasInit( canvas: HTMLCanvasElement ): void {
  inspector.setup( canvas );
}

const clock = new THREE.Clock();

function update(): void {
  requestAnimationFrame( update );

  const delta = clock.getDelta();
  inspector.update( delta );
}
update();

ReactDOM.render(
  <App onCanvasInit={ handleCanvasInit } progress={ progress } />,
  uiContainer
);
