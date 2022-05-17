import 'webgl-memory';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { EventEmittable } from '../utils/EventEmittable';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { InspectorAnimationPlugin } from './plugins/InspectorAnimationPlugin';
import { InspectorCameraControlsPlugin } from './plugins/InspectorCameraControlsPlugin';
import { InspectorHumanoidTransformPlugin } from './plugins/InspectorHumanoidTransformPlugin';
import { InspectorLookAtPlugin } from './plugins/InspectorLookAtPlugin';
import { InspectorModel } from './InspectorModel';
import { VRM, VRMLoaderPlugin, VRMLookAtHelper, VRMLookAtLoaderPlugin, VRMSpringBoneColliderHelper, VRMSpringBoneJointHelper, VRMSpringBoneLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { ValidationReport } from './ValidationReport';
import { WebGLMemoryExtension } from './WebGLMemoryExtension';
import { WebGLMemoryInfo } from './WebGLMemoryInfo';
import { WebIO } from '@gltf-transform/core';
import { applyMixins } from '../utils/applyMixins';
import { createAxisHelpers } from './createAxisHelpers';
import { forEachMeshMaterials } from '../utils/forEachMeshMaterials';
import { validateBytes } from 'gltf-validator';
import CameraControls from 'camera-controls';
import cubemapXn from '../assets/cubemap/xn.jpg';
import cubemapXp from '../assets/cubemap/xp.jpg';
import cubemapYn from '../assets/cubemap/yn.jpg';
import cubemapYp from '../assets/cubemap/yp.jpg';
import cubemapZn from '../assets/cubemap/zn.jpg';
import cubemapZp from '../assets/cubemap/zp.jpg';
import type { InspectorPlugin } from './plugins/InspectorPlugin';
import type { InspectorStats } from './InspectorStats';

const _v3A = new THREE.Vector3();

CameraControls.install( { THREE } );

export class Inspector {
  public static get VALIDATOR_MAX_ISSUES(): number {
    return 100;
  }

  public readonly animationPlugin: InspectorAnimationPlugin;
  public readonly cameraControlsPlugin: InspectorCameraControlsPlugin;
  public readonly humanoidTransformPlugin: InspectorHumanoidTransformPlugin;
  public readonly lookAtPlugin: InspectorLookAtPlugin;

  private _scene: THREE.Scene;
  private _lookAtHelperRoot: THREE.Group;
  private _springBoneJointHelperRoot: THREE.Group;
  private _springBoneColliderHelperRoot: THREE.Group;
  private _camera: THREE.PerspectiveCamera;
  private _renderer?: THREE.WebGLRenderer;
  private _model?: InspectorModel | null;
  private _stats: InspectorStats | null = null;
  private _webglMemory: WebGLMemoryExtension | null = null;
  private _webglMemoryInfo: WebGLMemoryInfo | null = null;
  private _dracoLoader: DRACOLoader;
  private _loader: GLTFLoader;
  private _canvas?: HTMLCanvasElement;
  private _layerMode: 'firstPerson' | 'thirdPerson' = 'thirdPerson';
  private _handleResize?: () => void;
  private _ongoingRequestEnvMap?: Promise<THREE.CubeTexture>;
  private _plugins: InspectorPlugin[];

  public get scene(): THREE.Scene { return this._scene; }
  public get camera(): THREE.PerspectiveCamera { return this._camera; }
  public get lookAtHelperRoot(): THREE.Group {
    return this._lookAtHelperRoot;
  }
  public get springBoneJointHelperRoot(): THREE.Group {
    return this._springBoneJointHelperRoot;
  }
  public get springBoneColliderHelperRoot(): THREE.Group {
    return this._springBoneColliderHelperRoot;
  }
  public get model(): InspectorModel | null { return this._model ?? null; }
  public get stats(): InspectorStats | null { return this._stats; }
  public get webglMemoryInfo(): WebGLMemoryInfo | null { return this._webglMemoryInfo; }
  public get canvas(): HTMLCanvasElement | undefined { return this._canvas; }
  public get layerMode(): 'firstPerson' | 'thirdPerson' { return this._layerMode; }

  public set layerMode( mode: 'firstPerson' | 'thirdPerson' ) {
    this._layerMode = mode;
    this._updateLayerMode();
  }

  public constructor() {
    // camera
    this._camera = new THREE.PerspectiveCamera(
      30.0,
      window.innerWidth / window.innerHeight,
      0.1,
      20.0
    );
    this._camera.position.set( 0.0, 1.0, 5.0 );

    // scene
    this._scene = new THREE.Scene();

    this._lookAtHelperRoot = new THREE.Group();
    this._lookAtHelperRoot.renderOrder = 10000;
    this._scene.add( this._lookAtHelperRoot );

    this._springBoneJointHelperRoot = new THREE.Group();
    this._springBoneJointHelperRoot.renderOrder = 10000;
    this._scene.add( this._springBoneJointHelperRoot );

    this._springBoneColliderHelperRoot = new THREE.Group();
    this._springBoneColliderHelperRoot.renderOrder = 10000;
    this._scene.add( this._springBoneColliderHelperRoot );

    // light
    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1.0, 1.0, 1.0 ).normalize();
    this._scene.add( light );

    // helpers
    const gridHelper = new THREE.GridHelper( 10, 10 );
    this._scene.add( gridHelper );

    const axesHelper = new THREE.AxesHelper( 5 );
    this._scene.add( axesHelper );

    // loader
    this._dracoLoader = new DRACOLoader();
    this._dracoLoader.setDecoderPath( './draco/' );

    this._loader = new GLTFLoader();
    this._loader.setDRACOLoader( this._dracoLoader );
    this._loader.register( ( parser ) => new VRMLoaderPlugin( parser, {
      lookAtPlugin: new VRMLookAtLoaderPlugin( parser, {
        helperRoot: this._lookAtHelperRoot,
      } ),
      springBonePlugin: new VRMSpringBoneLoaderPlugin( parser, {
        jointHelperRoot: this._springBoneJointHelperRoot,
        colliderHelperRoot: this._springBoneColliderHelperRoot,
      } ),
    } ) );

    // plugins
    this.animationPlugin = new InspectorAnimationPlugin( this );
    this.cameraControlsPlugin = new InspectorCameraControlsPlugin( this );
    this.humanoidTransformPlugin = new InspectorHumanoidTransformPlugin( this );
    this.lookAtPlugin = new InspectorLookAtPlugin( this );

    this._plugins = [
      this.animationPlugin,
      this.cameraControlsPlugin,
      this.humanoidTransformPlugin,
      this.lookAtPlugin,
    ];
  }

  public unloadVRM(): void {
    const model = this._model;

    if ( model ) {
      this._scene.remove( model.scene );
      VRMUtils.deepDispose( model.scene );
      this._emit( 'unload' );
    }

    // plugins
    this._plugins.forEach( ( plugin ) => plugin.handleAfterUnload?.() );

    this._springBoneJointHelperRoot.children.concat().forEach( ( helper ) => {
      this._springBoneJointHelperRoot.remove( helper );
      ( helper as VRMSpringBoneJointHelper ).dispose();
    } );

    this._springBoneColliderHelperRoot.children.concat().forEach( ( helper ) => {
      this._springBoneColliderHelperRoot.remove( helper );
      ( helper as VRMSpringBoneColliderHelper ).dispose();
    } );

    this._lookAtHelperRoot.children.concat().forEach( ( helper ) => {
      this._lookAtHelperRoot.remove( helper );
      ( helper as VRMLookAtHelper ).dispose();
    } );

    this._model = null;
  }

  public async loadVRM( url: string ): Promise<InspectorModel | null> {
    const buffer = await fetch( url ).then( ( res ) => res.arrayBuffer() );
    const validationReport = await validateBytes(
      new Uint8Array( buffer ),
      {
        maxIssues: Inspector.VALIDATOR_MAX_ISSUES,
      }
    ).catch( ( error ) => console.error( 'Validation failed: ', error ) );

    this._emit( 'validate', validationReport );

    this.unloadVRM();

    const webIO = new WebIO( { credentials: 'include' } );
    const originalGLTFJSON = webIO.binaryToJSON( buffer ).json;

    const gltf = await new Promise<GLTF>( ( resolve, reject ) => {
      this._loader.crossOrigin = 'anonymous';
      this._loader.load(
        url,
        ( gltf ) => { resolve( gltf ); },
        ( progress ) => { this._emit( 'progress', progress ); },
        ( error ) => { this._emit( 'error', error ); reject( error ); }
      );
    } );

    VRMUtils.removeUnnecessaryVertices( gltf.scene );
    VRMUtils.removeUnnecessaryJoints( gltf.scene );

    const vrm: VRM | null = gltf.userData.vrm ?? null;

    if ( vrm == null ) {
      console.warn( 'Failed to load the model as a VRM. Fallback to treat the model as a mere GLTF' );
    }

    this._stats = await this._prepareStats( gltf, vrm );

    if ( vrm ) {
      createAxisHelpers( vrm );
    }

    const scene = ( vrm?.scene ?? gltf.scene ) as THREE.Group;
    this._scene.add( scene );

    const model: InspectorModel = {
      gltf,
      validationReport,
      originalGLTFJSON,
      vrm,
      scene,
    };

    this._model = model;

    // plugins
    this._plugins.forEach( ( plugin ) => plugin.handleAfterLoad?.( model ) );

    if ( vrm ) {
      vrm.firstPerson?.setup();
      this._updateLayerMode();

      vrm.scene.traverse( ( object ) => {
        if ( 'isMesh' in object ) {
          forEachMeshMaterials( object as THREE.Mesh, async ( material ) => {
            if ( 'isMeshStandardMaterial' in material ) {
              ( material as THREE.MeshStandardMaterial ).envMap = await this._requestEnvMap();
            }
          } );
        }
      } );

      VRMUtils.rotateVRM0( vrm );

      vrm.springBoneManager?.setInitState();
      vrm.nodeConstraintManager?.setInitState();
    }

    this._emit( 'load', model );

    return model;
  }

  public async exportBufferView( index: number ): Promise<void> {
    const gltf = this._model?.gltf;
    if ( gltf == null ) { return; }

    const bufferView = await gltf.parser.getDependency( 'bufferView', index );
    const blob = new Blob( [ bufferView ] );
    const url = URL.createObjectURL( blob );

    const a = document.createElement( 'a' );
    a.href = url;
    a.download = `${ index }.bin`;
    a.click();
    URL.revokeObjectURL( url );
  }

  public setup( canvas: HTMLCanvasElement ): void {
    this._canvas = canvas;

    // renderer
    this._renderer = new THREE.WebGLRenderer( { canvas: this._canvas } );
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.setPixelRatio( window.devicePixelRatio );

    // resize listener
    if ( this._handleResize ) {
      window.removeEventListener( 'resize', this._handleResize );
    }
    this._handleResize = () => {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();

      this._renderer!.setSize( window.innerWidth, window.innerHeight );
    };
    window.addEventListener( 'resize', this._handleResize );

    // webgl-memory
    this._webglMemory = this._renderer.getContext().getExtension( 'GMAN_webgl_memory' ) as WebGLMemoryExtension;

    // plugins
    this._plugins.forEach( ( plugin ) => plugin.handleAfterSetup?.() );
  }

  public registerDnD( target: HTMLElement ): () => void {
    const handleDragOver = ( event: DragEvent ): void => {
      event.preventDefault();
    };

    const handleDrop = ( event: DragEvent ): void => {
      event.preventDefault();

      // read given file then convert it to blob url
      const files = event.dataTransfer!.files;
      if ( !files ) { return; }
      const file = files[ 0 ];
      if ( !file ) { return; }
      const blob = new Blob( [ file ], { type: 'application/octet-stream' } );
      const url = URL.createObjectURL( blob );
      this.loadVRM( url );
    };

    target.addEventListener( 'dragover', handleDragOver );
    target.addEventListener( 'drop', handleDrop );

    return () => {
      target.removeEventListener( 'dragover', handleDragOver );
      target.removeEventListener( 'drop', handleDrop );
    };
  }

  public update( delta: number ): void {
    if ( this._model?.vrm ) { this._model.vrm.update( delta ); }

    // plugins
    this._plugins.forEach( ( plugin ) => plugin.handleBeforeRender?.( delta ) );

    if ( this._renderer ) {
      this._renderer.render( this._scene, this._camera );
    }

    if ( this._webglMemory ) {
      this._webglMemoryInfo = this._webglMemory.getMemoryInfo();
    }
  }

  private async _prepareStats(
    gltf: GLTF,
    vrm: VRM | null,
  ): Promise<InspectorStats | null> {
    const dimensionBox = new THREE.Box3();
    const positionBuffers = new Set<THREE.BufferAttribute>();
    let nMeshes = 0;
    let nPrimitives = 0;
    let nPolygons = 0;

    const processMesh = ( mesh: THREE.Mesh ): void => {
      nPrimitives ++;

      const geometry = mesh.geometry as THREE.BufferGeometry;
      dimensionBox.expandByObject( mesh );
      const buffer = geometry.getAttribute( 'position' ) as THREE.BufferAttribute;
      positionBuffers.add( buffer );
      nPolygons += ( geometry.index?.count ?? buffer.count ) / 3;
    };

    const meshes: Array<THREE.Group | THREE.Mesh | THREE.SkinnedMesh> = await gltf.parser.getDependencies( 'mesh' );
    meshes.forEach( ( meshOrGroup ) => {
      nMeshes ++;

      if ( ( meshOrGroup as any ).isMesh ) {
        processMesh( meshOrGroup as THREE.Mesh );
      } else {
        const group = meshOrGroup as THREE.Group;
        group.children.forEach( ( child ) => {
          processMesh( child as THREE.Mesh );
        } );
      }
    } );

    let nVertices = 0;
    for ( const buffer of positionBuffers ) {
      nVertices += buffer.count;
    }

    const materials: Array<THREE.Material> = await gltf.parser.getDependencies( 'material' );

    const nSpringBones = vrm?.springBoneManager?.springBones?.size ?? 0;

    return {
      dimension: dimensionBox.getSize( _v3A ).toArray(),
      vertices: nVertices,
      polygons: nPolygons,
      meshes: nMeshes,
      primitives: nPrimitives,
      materials: materials.length,
      springBones: nSpringBones,
    };
  }

  private _requestEnvMap(): Promise<THREE.CubeTexture> {
    // envmap
    const envMapUrl = [
      cubemapXp,
      cubemapXn,
      cubemapYp,
      cubemapYn,
      cubemapZp,
      cubemapZn,
    ];

    if ( !this._ongoingRequestEnvMap ) {
      const loader = new THREE.CubeTextureLoader();
      this._ongoingRequestEnvMap = new Promise( ( resolve, reject ) => {
        loader.load(
          envMapUrl,
          ( texture ) => resolve( texture ),
          undefined,
          ( error ) => reject( error )
        );
      } );
    }

    return this._ongoingRequestEnvMap;
  }

  private _updateLayerMode(): void {
    const firstPerson = this._model?.vrm?.firstPerson;

    if ( !firstPerson ) { return; }

    if ( this._layerMode === 'firstPerson' ) {
      this._camera.layers.enable( firstPerson.firstPersonOnlyLayer );
      this._camera.layers.disable( firstPerson.thirdPersonOnlyLayer );
    } else {
      this._camera.layers.disable( firstPerson.firstPersonOnlyLayer );
      this._camera.layers.enable( firstPerson.thirdPersonOnlyLayer );
    }
  }
}

export interface InspectorEvents {
  load: InspectorModel | null;
  updateStats: InspectorStats;
  unload: void;
  validate: ValidationReport;
  progress: ProgressEvent;
  error: any;
}

export interface Inspector extends EventEmittable<InspectorEvents> {}
applyMixins( Inspector, [ EventEmittable ] );
