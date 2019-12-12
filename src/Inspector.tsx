import * as THREE from 'three';
import { VRM, VRMSchema } from '@pixiv/three-vrm';
import CameraControls from 'camera-controls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

CameraControls.install( { THREE } );

export class Inspector {
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer?: THREE.WebGLRenderer;
  private _controls?: CameraControls;
  private _vrm?: VRM;
  private _loader: GLTFLoader = new GLTFLoader();
  private _canvas?: HTMLCanvasElement;

  public get scene(): THREE.Scene { return this._scene; }
  public get vrm(): VRM | undefined { return this._vrm; }
  public get canvas(): HTMLCanvasElement | undefined { return this._canvas; }

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

  public loadVRM( url: string, onProgress?: ( progress: ProgressEvent ) => void ): Promise<VRM> {
    return new Promise<VRM>( ( resolve, reject ) => {
      this._loader.crossOrigin = 'anonymous';
      this._loader.load(
        url,
        ( gltf ) => {
          VRM.from( gltf ).then( ( vrm ) => {
            if ( this._vrm ) {
              this._scene.remove( this._vrm.scene );
              this._vrm.dispose();
            }

            this._vrm = vrm;
            this._scene.add( vrm.scene );

            const hips = vrm.humanoid!.getBoneNode( VRMSchema.HumanoidBoneName.Hips )!;
            hips.rotation.y = Math.PI;

            console.info( vrm );

            resolve( vrm );
          } );
        },
        onProgress,
        ( error ) => reject( error )
      );
    } );
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
  }

  public registerDnD(
    target: HTMLElement,
    onLoad?: ( vrm: VRM ) => void,
    onProgress?: ( progress: ProgressEvent ) => void,
    onError?: ( error: any ) => void
  ): () => void {
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
      this.loadVRM( url, onProgress ).then( onLoad ).catch( onError );
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
}
