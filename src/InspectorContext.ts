import * as THREE from 'three';
import { Highlighter } from './inspector/Highlighter';
import { Inspector } from './inspector/Inspector';
import { MaterialDebugger } from './inspector/MaterialDebugger';
import React from 'react';
import threeVrmGirlVrm00Vrm from './assets/models/three-vrm-girl-vrm0.0.vrm';

function handleError( error: any ): void {
  console.error( error );
}

const inspector = new Inspector();
inspector.loadVRM( threeVrmGirlVrm00Vrm ).catch( handleError );
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
