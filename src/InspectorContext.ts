import * as THREE from 'three';
import { Highlighter } from './inspector/Highlighter';
import { Inspector } from './inspector/Inspector';
import { MaterialDebugger } from './inspector/MaterialDebugger';
import React from 'react';
import vrm1ConstraintTwistSampleVrm from './assets/models/VRM1_Constraint_Twist_Sample.vrm?url';

function handleError( error: any ): void {
  console.error( error );
}

const inspector = new Inspector();
inspector.loadVRM( vrm1ConstraintTwistSampleVrm ).catch( handleError );
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
