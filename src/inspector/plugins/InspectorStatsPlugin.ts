import type { VRM } from '@pixiv/three-vrm';
import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { applyMixins } from '../../utils/applyMixins';
import { EventEmittable } from '../../utils/EventEmittable';
import type { Inspector } from '../Inspector';
import type { InspectorModel } from '../InspectorModel';
import type { InspectorPlugin } from './InspectorPlugin';

const _v3A = new THREE.Vector3();

export interface InspectorStatsPluginStats {
  dimension: [number, number, number];
  vertices: number;
  polygons: number;
  meshes: number;
  primitives: number;
  textures: number;
  materials: number;
  joints: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-object-type
export interface InspectorStatsPlugin
  extends EventEmittable<{
    update: { stats: InspectorStatsPluginStats | null };
  }> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class InspectorStatsPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public constructor(inspector: Inspector) {
    this.inspector = inspector;
  }

  public handleAfterLoad(model: InspectorModel): void {
    const { gltf, vrm } = model;
    this._prepareStats(gltf, vrm).then((stats) => {
      this._emit('update', { stats });
    });
  }

  public handleAfterUnload(): void {
    this._emit('update', { stats: null });
  }

  private async _prepareStats(
    gltf: GLTF,
    vrm: VRM | null,
  ): Promise<InspectorStatsPluginStats | null> {
    const dimensionBox = new THREE.Box3();
    const positionBuffers = new Set<THREE.BufferAttribute>();
    let nMeshes = 0;
    let nPrimitives = 0;
    let nPolygons = 0;

    const processMesh = (mesh: THREE.Mesh): void => {
      nPrimitives++;

      const geometry = mesh.geometry as THREE.BufferGeometry;
      dimensionBox.expandByObject(mesh);
      const buffer = geometry.getAttribute('position') as THREE.BufferAttribute;
      positionBuffers.add(buffer);
      nPolygons += (geometry.index?.count ?? buffer.count) / 3;
    };

    const meshes: Array<THREE.Group | THREE.Mesh | THREE.SkinnedMesh> =
      await gltf.parser.getDependencies('mesh');
    meshes.forEach((meshOrGroup) => {
      nMeshes++;

      if (meshOrGroup instanceof THREE.Mesh) {
        processMesh(meshOrGroup);
      } else {
        meshOrGroup.children.forEach((child) => {
          // mesh descendants might have joints
          if (child instanceof THREE.Mesh) {
            processMesh(child);
          }
        });
      }
    });

    let nVertices = 0;
    for (const buffer of positionBuffers) {
      nVertices += buffer.count;
    }

    const textures: Array<THREE.Material> =
      await gltf.parser.getDependencies('texture');
    const materials: Array<THREE.Material> =
      await gltf.parser.getDependencies('material');

    const nJoints = vrm?.springBoneManager?.joints?.size ?? 0;

    return {
      dimension: dimensionBox.getSize(_v3A).toArray(),
      vertices: nVertices,
      polygons: nPolygons,
      meshes: nMeshes,
      primitives: nPrimitives,
      textures: textures.length,
      materials: materials.length,
      joints: nJoints,
    };
  }
}

applyMixins(InspectorStatsPlugin, [EventEmittable]);
