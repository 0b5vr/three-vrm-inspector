import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMDebug, VRMMaterialImporter, VRMSchema } from '@pixiv/three-vrm';
import CameraControls from 'camera-controls';
import { EventEmittable } from '../utils/EventEmittable';
import type { InspectorStats } from './InspectorStats';
import { ValidationReport } from './ValidationReport';
import { applyMixins } from '../utils/applyMixins';
import { createAxisHelpers } from './createAxisHelpers';
import cubemapXn from '../assets/cubemap/xn.jpg';
import cubemapXp from '../assets/cubemap/xp.jpg';
import cubemapYn from '../assets/cubemap/yn.jpg';
import cubemapYp from '../assets/cubemap/yp.jpg';
import cubemapZn from '../assets/cubemap/zn.jpg';
import cubemapZp from '../assets/cubemap/zp.jpg';
import { validateBytes } from 'gltf-validator';

const _v3A = new THREE.Vector3();

CameraControls.install( { THREE } );

export class Inspector {
  public static get VALIDATOR_MAX_ISSUES(): number {
    return 100;
  }

  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer?: THREE.WebGLRenderer;
  private _controls?: CameraControls;
  private _gltf?: GLTF;
  private _validationReport?: ValidationReport;
  private _vrm?: VRMDebug | null;
  private _currentModelScene?: THREE.Group;
  private _stats: InspectorStats | null = null;
  private _loader: GLTFLoader = new GLTFLoader();
  private _canvas?: HTMLCanvasElement;
  private _layerMode: 'firstPerson' | 'thirdPerson' = 'thirdPerson';
  private _handleResize?: () => void;
  private _ongoingRequestEnvMap?: Promise<THREE.CubeTexture>;

  public get scene(): THREE.Scene { return this._scene; }
  public get gltf(): GLTF | undefined { return this._gltf; }
  public get validationReport(): ValidationReport | undefined { return this._validationReport; }
  public get vrm(): VRMDebug | null | undefined { return this._vrm; }
  public get stats(): InspectorStats | null { return this._stats; }
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

    // light
    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1.0, 1.0, 1.0 ).normalize();
    this._scene.add( light );

    // helpers
    const gridHelper = new THREE.GridHelper( 10, 10 );
    this._scene.add( gridHelper );

    const axesHelper = new THREE.AxesHelper( 5 );
    this._scene.add( axesHelper );
  }

  public unloadVRM(): void {
    if ( this._currentModelScene ) {
      this._scene.remove( this._currentModelScene );
    }

    if ( this._vrm ) {
      this._vrm.dispose();
      this._emit( 'unload' );
    }
  }

  public async loadVRM( url: string ): Promise<VRMDebug | null> {
    const buffer = await fetch( url ).then( ( res ) => res.arrayBuffer() );
    const validationReport = await validateBytes(
      new Uint8Array( buffer ),
      {
        maxIssues: Inspector.VALIDATOR_MAX_ISSUES,
      }
    ).catch( ( error ) => console.error( 'Validation failed: ', error ) );

    this._validationReport = validationReport;
    this._emit( 'validate', validationReport );

    const gltf = await new Promise<GLTF>( ( resolve, reject ) => {
      this._loader.crossOrigin = 'anonymous';
      this._loader.load(
        url,
        ( gltf ) => { resolve( gltf ); },
        ( progress ) => { this._emit( 'progress', progress ); },
        ( error ) => { this._emit( 'error', error ); reject( error ); }
      );
    } );
    this._gltf = gltf;

    this.unloadVRM();

    const vrm = await VRMDebug.from(
      gltf,
      {
        materialImporter: new VRMMaterialImporter( {
          requestEnvMap: () => this._requestEnvMap(),
        } ),
      }
    ).catch( ( e ) => {
      console.warn( e );
      console.warn( 'Failed to load the model as a VRM. Fallback to treat the model as a mere GLTF' );
      return null;
    } );

    this._stats = await this._prepareStats( gltf, vrm );

    if ( vrm ) {
      createAxisHelpers( vrm );
    }

    this._vrm = vrm;

    this._currentModelScene = ( vrm?.scene ?? gltf.scene ) as THREE.Group;
    this._scene.add( this._currentModelScene );

    if ( this._vrm ) {
      this._vrm.firstPerson!.setup();
      this._updateLayerMode();

      const hips = this._vrm.humanoid!.getBoneNode( VRMSchema.HumanoidBoneName.Hips )!;
      hips.rotation.y = Math.PI;
    }

    this._emit( 'load', vrm );

    return this._vrm;
  }

  public setup( canvas: HTMLCanvasElement ): void {
    this._canvas = canvas;

    // renderer
    this._renderer = new THREE.WebGLRenderer( { canvas: this._canvas } );
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.setPixelRatio( window.devicePixelRatio );

    // camera controls
    this._controls = new CameraControls( this._camera, this._canvas );
    this._controls.setTarget( 0.0, 1.0, 0.0 );

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
    if ( this._controls ) { this._controls.update( delta ); }
    if ( this._vrm ) { this._vrm.update( delta ); }

    if ( this._renderer ) {
      this._renderer.render( this._scene, this._camera );
    }
  }

  private async _prepareStats( gltf: GLTF, vrm: VRM | null ): Promise<InspectorStats | null> {
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

    let nSpringBones = 0;

    vrm?.springBoneManager?.springBoneGroupList?.forEach( ( group ) => {
      nSpringBones += group.length;
    } );

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
    if ( !this._vrm ) { throw new Error( 'bazinga' ); }

    if ( this._layerMode === 'firstPerson' ) {
      this._camera.layers.enable( this._vrm.firstPerson!.firstPersonOnlyLayer );
      this._camera.layers.disable( this._vrm.firstPerson!.thirdPersonOnlyLayer );
    } else {
      this._camera.layers.disable( this._vrm.firstPerson!.firstPersonOnlyLayer );
      this._camera.layers.enable( this._vrm.firstPerson!.thirdPersonOnlyLayer );
    }
  }
}

export interface InspectorEvents {
  load: VRM | null;
  updateStats: InspectorStats;
  unload: void;
  validate: ValidationReport;
  progress: ProgressEvent;
  error: any;
}

export interface Inspector extends EventEmittable<InspectorEvents> {}
applyMixins( Inspector, [ EventEmittable ] );
