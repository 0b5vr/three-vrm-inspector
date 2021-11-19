import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMLoaderPlugin, VRMSpringBoneColliderHelper, VRMSpringBoneJointHelper, VRMSpringBoneLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
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
import { forEachMeshMaterials } from '../utils/forEachMeshMaterials';
import { loadMixamoAnimation } from './loadMixamoAnimation';
import { validateBytes } from 'gltf-validator';

const _v3A = new THREE.Vector3();

CameraControls.install( { THREE } );

export class Inspector {
  public static get VALIDATOR_MAX_ISSUES(): number {
    return 100;
  }

  private _scene: THREE.Scene;
  private _springBoneJointHelperRoot: THREE.Group;
  private _springBoneColliderHelperRoot: THREE.Group;
  private _camera: THREE.PerspectiveCamera;
  private _renderer?: THREE.WebGLRenderer;
  private _controls?: CameraControls;
  private _gltf?: GLTF;
  private _validationReport?: ValidationReport;
  private _vrm?: VRM | null;
  private _currentModelScene?: THREE.Group;
  private _animationMixer?: THREE.AnimationMixer | null;
  private _currentAnimationAction?: THREE.AnimationAction | null;
  private _currentAnimationURL?: string | null;
  private _stats: InspectorStats | null = null;
  private _loader: GLTFLoader;
  private _canvas?: HTMLCanvasElement;
  private _layerMode: 'firstPerson' | 'thirdPerson' = 'thirdPerson';
  private _handleResize?: () => void;
  private _ongoingRequestEnvMap?: Promise<THREE.CubeTexture>;

  public get scene(): THREE.Scene { return this._scene; }
  public get springBoneJointHelperRoot(): THREE.Group {
    return this._springBoneJointHelperRoot;
  }
  public get springBoneColliderHelperRoot(): THREE.Group {
    return this._springBoneColliderHelperRoot;
  }
  public get gltf(): GLTF | undefined { return this._gltf; }
  public get validationReport(): ValidationReport | undefined { return this._validationReport; }
  public get vrm(): VRM | null | undefined { return this._vrm; }
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
    this._loader = new GLTFLoader();
    this._loader.register( ( parser ) => new VRMLoaderPlugin( parser, {
      springBonePlugin: new VRMSpringBoneLoaderPlugin( parser, {
        jointHelperRoot: this._springBoneJointHelperRoot,
        colliderHelperRoot: this._springBoneColliderHelperRoot,
      } ),
    } ) );
  }

  public unloadVRM(): void {
    if ( this._currentModelScene ) {
      this._scene.remove( this._currentModelScene );
    }

    if ( this._vrm ) {
      VRMUtils.deepDispose( this._vrm.scene );
      this._emit( 'unload' );
    }

    this._animationMixer = null;
    this._currentAnimationAction = null;

    this._springBoneJointHelperRoot.children.concat().forEach( ( helper ) => {
      this._springBoneJointHelperRoot.remove( helper );
      ( helper as VRMSpringBoneJointHelper ).dispose();
    } );

    this._springBoneColliderHelperRoot.children.concat().forEach( ( helper ) => {
      this._springBoneColliderHelperRoot.remove( helper );
      ( helper as VRMSpringBoneColliderHelper ).dispose();
    } );
  }

  public async loadVRM( url: string ): Promise<VRM | null> {
    const buffer = await fetch( url ).then( ( res ) => res.arrayBuffer() );
    const validationReport = await validateBytes(
      new Uint8Array( buffer ),
      {
        maxIssues: Inspector.VALIDATOR_MAX_ISSUES,
      }
    ).catch( ( error ) => console.error( 'Validation failed: ', error ) );

    this._validationReport = validationReport;
    this._emit( 'validate', validationReport );

    this.unloadVRM();

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

    const vrm: VRM | null = this._vrm = gltf.userData.vrm ?? null;

    if ( vrm == null ) {
      console.warn( 'Failed to load the model as a VRM. Fallback to treat the model as a mere GLTF' );
    }

    this._stats = await this._prepareStats( gltf, vrm );

    if ( vrm ) {
      createAxisHelpers( vrm );
    }

    this._currentModelScene = ( vrm?.scene ?? gltf.scene ) as THREE.Group;
    this._scene.add( this._currentModelScene );

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

      this._animationMixer = new THREE.AnimationMixer( vrm.scene );

      if ( this._currentAnimationURL != null ) {
        this.loadMixamoAnimation( this._currentAnimationURL );
      }
    }

    this._emit( 'load', vrm );

    return vrm;
  }

  public async exportBufferView( index: number ): Promise<void> {
    const gltf = this._gltf;
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

  public loadMixamoAnimation( url: string ): void {
    const vrm = this._vrm;
    const mixer = this._animationMixer;
    if ( !vrm || !mixer ) { return; }

    if ( this._currentAnimationAction ) {
      this.clearMixamoAnimation();
    }

    loadMixamoAnimation( url, vrm ).then( ( clip ) => {
      if ( clip ) {
        this._currentAnimationURL = url;
        this._currentAnimationAction = mixer.clipAction( clip );
        this._currentAnimationAction.play();
      }
    } );
  }

  public clearMixamoAnimation(): void {
    const vrm = this._vrm;
    const action = this._currentAnimationAction;
    if ( !vrm || !action ) { return; }

    this._currentAnimationURL = null;
    action.stop();
    this._currentAnimationAction = null;

    vrm.humanoid?.resetPose();
  }

  public update( delta: number ): void {
    if ( this._controls ) { this._controls.update( delta ); }
    if ( this._animationMixer ) { this._animationMixer.update( delta ); }
    if ( this._vrm ) { this._vrm.update( delta ); }

    if ( this._renderer ) {
      this._renderer.render( this._scene, this._camera );
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
    const firstPerson = this._vrm?.firstPerson;

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
  load: VRM | null;
  updateStats: InspectorStats;
  unload: void;
  validate: ValidationReport;
  progress: ProgressEvent;
  error: any;
}

export interface Inspector extends EventEmittable<InspectorEvents> {}
applyMixins( Inspector, [ EventEmittable ] );
