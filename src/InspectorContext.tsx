import * as THREE from 'three';
import { Inspector } from './Inspector';
import React from 'react';

function handleError( error: any ): void {
  console.error( error );
}

const inspector: Inspector = new Inspector();
inspector.loadVRM( './assets/models/three-vrm-girl.vrm' ).catch( handleError );
inspector.registerDnD( document.body );

console.info( inspector );

const clock = new THREE.Clock();

function update(): void {
  requestAnimationFrame( update );

  const delta = clock.getDelta();
  inspector.update( delta );
}
update();

export const InspectorContext = React.createContext<Inspector>( inspector );
