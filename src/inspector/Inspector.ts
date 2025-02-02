import 'webgl-memory';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { EventEmittable } from '../utils/EventEmittable';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { InspectorAnimationPlugin } from './plugins/InspectorAnimationPlugin';
import { InspectorCameraControlsPlugin } from './plugins/InspectorCameraControlsPlugin';
import { InspectorGLTFValidatorPlugin } from './plugins/InspectorGLTFValidatorPlugin';
import { InspectorHelpersPlugin } from './plugins/InspectorHelpersPlugin';
import { InspectorHumanoidTransformPlugin } from './plugins/InspectorHumanoidTransformPlugin';
import { InspectorLightsPlugin } from './plugins/InspectorLightsPlugin';
import { InspectorLookAtBallPlugin } from './plugins/InspectorLookAtBallPlugin';
import { InspectorLookAtPlugin } from './plugins/InspectorLookAtPlugin';
import { InspectorModel } from './InspectorModel';
import { InspectorPostProcessingPlugin } from './plugins/InspectorPostProcessingPlugin';
import { InspectorStatsPlugin } from './plugins/InspectorStatsPlugin';
import { InspectorTexturesPlugin } from './plugins/InspectorTexturesPlugin';
import { InspectorVisualizeWeightPlugin } from './plugins/InspectorVisualizeWeightPlugin';
import { InspectorWebGLMemoryPlugin } from './plugins/InspectorWebGLMemoryPlugin';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { VRM, VRMHumanoidLoaderPlugin, VRMLoaderPlugin, VRMLookAtLoaderPlugin, VRMSpringBoneLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { WebIO } from '@gltf-transform/core';
import { applyMixins } from '../utils/applyMixins';
import { forEachMeshMaterials } from '../utils/forEachMeshMaterials';
import { removeUnnecessaryJoints } from './utils/removeUnnecessaryJoints';
import CameraControls from 'camera-controls';
import cubemapXn from '../assets/cubemap/xn.jpg';
import cubemapXp from '../assets/cubemap/xp.jpg';
import cubemapYn from '../assets/cubemap/yn.jpg';
import cubemapYp from '../assets/cubemap/yp.jpg';
import cubemapZn from '../assets/cubemap/zn.jpg';
import cubemapZp from '../assets/cubemap/zp.jpg';
import type { InspectorPlugin } from './plugins/InspectorPlugin';

CameraControls.install( { THREE } );

export class Inspector {
  public readonly animationPlugin: InspectorAnimationPlugin;
  public readonly cameraControlsPlugin: InspectorCameraControlsPlugin;
  public readonly gltfValidatorPlugin: InspectorGLTFValidatorPlugin;
  public readonly helpersPlugin: InspectorHelpersPlugin;
  public readonly humanoidTransformPlugin: InspectorHumanoidTransformPlugin;
  public readonly lightsPlugin: InspectorLightsPlugin;
  public readonly lookAtPlugin: InspectorLookAtPlugin;
  public readonly lookAtBallPlugin: InspectorLookAtBallPlugin;
  public readonly postProcessingPlugin: InspectorPostProcessingPlugin;
  public readonly statsPlugin: InspectorStatsPlugin;
  public readonly texturesPlugin: InspectorTexturesPlugin;
  public readonly visualizeWeightPlugin: InspectorVisualizeWeightPlugin;
  public readonly webglMemoryPlugin: InspectorWebGLMemoryPlugin;

  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer?: THREE.WebGLRenderer;
  private _composer?: EffectComposer;
  private _model?: InspectorModel | null;
  private _dracoLoader: DRACOLoader;
  private _ktx2Loader: KTX2Loader;
  private _loader: GLTFLoader;
  private _canvas?: HTMLCanvasElement;
  private _layerMode: 'firstPerson' | 'thirdPerson' = 'thirdPerson';
  private _handleResize?: () => void;
  private _ongoingRequestEnvMap?: Promise<THREE.CubeTexture>;
  private _plugins: InspectorPlugin[];

  public get scene(): THREE.Scene { return this._scene; }
  public get camera(): THREE.PerspectiveCamera { return this._camera; }
  public get renderer(): THREE.WebGLRenderer | undefined { return this._renderer; }
  public get composer(): EffectComposer | undefined { return this._composer; }
  public get model(): InspectorModel | null { return this._model ?? null; }
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

    // helpers plugin must be made before the loader
    this.helpersPlugin = new InspectorHelpersPlugin( this );

    // loader
    this._dracoLoader = new DRACOLoader();
    this._dracoLoader.setDecoderPath( './draco/' );

    this._ktx2Loader = new KTX2Loader();
    this._ktx2Loader.setTranscoderPath( './basis/' );

    this._loader = new GLTFLoader();
    this._loader.setDRACOLoader( this._dracoLoader );
    this._loader.setKTX2Loader( this._ktx2Loader );
    this._loader.register( ( parser ) => new VRMLoaderPlugin( parser, {
      humanoidPlugin: new VRMHumanoidLoaderPlugin( parser, {
        helperRoot: this.helpersPlugin.humanoidHelperRoot,
      } ),
      lookAtPlugin: new VRMLookAtLoaderPlugin( parser, {
        helperRoot: this.helpersPlugin.lookAtHelperRoot,
      } ),
      springBonePlugin: new VRMSpringBoneLoaderPlugin( parser, {
        jointHelperRoot: this.helpersPlugin.springBoneJointHelperRoot,
        colliderHelperRoot: this.helpersPlugin.springBoneColliderHelperRoot,
      } ),
    } ) );

    // plugins
    this.animationPlugin = new InspectorAnimationPlugin( this );
    this.cameraControlsPlugin = new InspectorCameraControlsPlugin( this );
    this.gltfValidatorPlugin = new InspectorGLTFValidatorPlugin( this );
    this.humanoidTransformPlugin = new InspectorHumanoidTransformPlugin( this );
    this.lightsPlugin = new InspectorLightsPlugin( this );
    this.lookAtPlugin = new InspectorLookAtPlugin( this );
    this.lookAtBallPlugin = new InspectorLookAtBallPlugin( this );
    this.postProcessingPlugin = new InspectorPostProcessingPlugin( this );
    this.statsPlugin = new InspectorStatsPlugin( this );
    this.texturesPlugin = new InspectorTexturesPlugin( this );
    this.visualizeWeightPlugin = new InspectorVisualizeWeightPlugin( this );
    this.webglMemoryPlugin = new InspectorWebGLMemoryPlugin( this );

    this._plugins = [
      this.animationPlugin,
      this.cameraControlsPlugin,
      this.gltfValidatorPlugin,
      this.helpersPlugin,
      this.humanoidTransformPlugin,
      this.lookAtPlugin,
      this.lookAtBallPlugin,
      this.postProcessingPlugin,
      this.statsPlugin,
      this.texturesPlugin,
      this.visualizeWeightPlugin,
      this.webglMemoryPlugin,
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

    this._model = null;
  }

  public async loadVRM( url: string ): Promise<InspectorModel | null> {
    const buffer = await fetch( url ).then( ( res ) => res.arrayBuffer() );

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
    this.visualizeWeightPlugin.boneIndexMap = removeUnnecessaryJoints( gltf.scene );

    let vrm: VRM | null = gltf.userData.vrm ?? null;

    // workaround
    if ( vrm?.humanoid == null ) {
      vrm = null;
    }

    if ( vrm == null ) {
      console.warn( 'Failed to load the model as a VRM. Fallback to treat the model as a mere GLTF' );
    }

    const scene = ( vrm?.scene ?? gltf.scene ) as THREE.Group;
    this._scene.add( scene );

    const model: InspectorModel = {
      buffer,
      gltf,
      originalGLTFJSON,
      vrm,
      scene,
    };

    this._model = model;

    // plugins
    this._plugins.forEach( ( plugin ) => plugin.handleAfterLoad?.( model ) );

    if ( vrm ) {
      // setup first person
      vrm.firstPerson?.setup();
      this._updateLayerMode();

      // set envmap
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

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio;

    // renderer
    this._renderer = new THREE.WebGLRenderer( {
      canvas: this._canvas,
      antialias: true,
    } );
    this._renderer.setSize( width, height );
    this._renderer.setPixelRatio( pixelRatio );

    this._ktx2Loader.detectSupport( this._renderer );

    // composer
    this._composer = new EffectComposer(
      this._renderer,
      new THREE.WebGLRenderTarget( width, height, { type: THREE.HalfFloatType } ),
    );
    this._composer.setPixelRatio( window.devicePixelRatio );

    const renderPass = new RenderPass( this._scene, this._camera );
    this._composer.addPass( renderPass );

    // resize listener
    if ( this._handleResize ) {
      window.removeEventListener( 'resize', this._handleResize );
    }
    this._handleResize = () => {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();

      this._renderer!.setSize( window.innerWidth, window.innerHeight );
      this._composer!.setSize( window.innerWidth, window.innerHeight );
    };
    window.addEventListener( 'resize', this._handleResize );

    // plugins
    this._plugins.forEach( ( plugin ) => plugin.handleAfterSetup?.() );
  }

  public registerDnD( target: HTMLElement ): () => void {
    const handleDragOver = ( event: DragEvent ): void => {
      event.preventDefault();
    };

    const handleDrop = async ( event: DragEvent ): Promise<void> => {
      event.preventDefault();

      // read given file then convert it to blob url
      const file = event.dataTransfer!.files?.[ 0 ];
      if ( !file ) { return; }

      const blob = new Blob( [ file ], { type: 'application/octet-stream' } );
      const url = URL.createObjectURL( blob );

      if ( file.name.endsWith( '.vrma' ) ) {
        // if the file extension is .vrma load as VRM Animation
        await this.animationPlugin.loadAnimation( { type: 'vrma', url, name: 'Custom Animation (VRMA)' } );
      } else {
        // otherwise load as VRM (or glTF)
        await this.loadVRM( url );
      }

      URL.revokeObjectURL( url );
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

    if ( this._composer ) {
      this._composer.render( delta );
    }
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
  unload: void;
  progress: ProgressEvent;
  error: any;
}

export interface Inspector extends EventEmittable<InspectorEvents> {}
applyMixins( Inspector, [ EventEmittable ] );
