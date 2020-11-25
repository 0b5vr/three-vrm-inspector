import * as THREE from 'three';
import { Highlighter } from './inspector/Highlighter';
import { Inspector } from './inspector/Inspector';
import { MaterialDebugger } from './inspector/MaterialDebugger';
import React from 'react';
import threeVrmGirlVrm from './assets/models/three-vrm-girl.vrm';

function handleError( error: any ): void {
  console.error( error );
}

const inspector = new Inspector();
inspector.loadVRM( threeVrmGirlVrm ).catch( handleError );
inspector.registerDnD( document.body );

const highlighter = new Highlighter( inspector );

const materialDebugger = new MaterialDebugger( inspector );

console.info( inspector );

const clock = new THREE.Clock();

function update(): void {
  requestAnimationFrame( update );

  const delta = clock.getDelta();
  inspector.update( delta );
}
update();

export const InspectorContext = React.createContext( {
  inspector,
  highlighter,
  materialDebugger
} );
