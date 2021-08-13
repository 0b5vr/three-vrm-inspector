import * as THREE from 'three';
import { Colors } from '../../constants/Colors';

const colorConstant = new THREE.Color( Colors.constant );

const highlightWireframeMaterial = new THREE.MeshBasicMaterial( {
  color: colorConstant,
  transparent: true,
  wireframe: true,
  depthTest: false,
  depthWrite: false
} );

const highlightSphereGeometry = new THREE.SphereBufferGeometry( 0.2 );

export function genGizmo( geom: THREE.BufferGeometry = highlightSphereGeometry ): THREE.Mesh {
  const mesh = new THREE.Mesh( geom, highlightWireframeMaterial );
  mesh.frustumCulled = false;
  mesh.renderOrder = 10000;
  return mesh;
}
