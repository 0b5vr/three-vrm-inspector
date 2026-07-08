import * as THREE from 'three';
import { Highlighter } from './inspector/Highlighter';
import { Inspector } from './inspector/Inspector';
import { MaterialDebugger } from './inspector/MaterialDebugger/MaterialDebugger';
import React from 'react';
import vrm1ConstraintTwistSampleVrm from './assets/models/VRM1_Constraint_Twist_Sample.vrm?url';

function handleError(error: any): void {
  console.error(error);
}

const inspector = new Inspector();
inspector.loadVRM(vrm1ConstraintTwistSampleVrm).catch(handleError);
inspector.registerDnD(document.body);

const highlighter = new Highlighter(inspector);

const materialDebugger = new MaterialDebugger(inspector);

console.info(inspector);

const timer = new THREE.Timer();
timer.connect(document);

function update(): void {
  requestAnimationFrame(update);

  timer.update();
  const delta = timer.getDelta();
  inspector.update(delta);
}
update();

export const InspectorContext = React.createContext({
  inspector,
  highlighter,
  materialDebugger,
});
