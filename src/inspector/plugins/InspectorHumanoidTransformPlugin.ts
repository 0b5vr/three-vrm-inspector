import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { registerMouseEvent } from '../../utils/registerMouseEvent';
import imageGrabPurple from '../../assets/grab-purple.png';
import type { Inspector } from '../Inspector';
import type { InspectorModel } from '../InspectorModel';
import type { InspectorPlugin } from './InspectorPlugin';

const _v2A = new THREE.Vector2();

export class InspectorHumanoidTransformPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _sprites?: THREE.Sprite[] | null;
  private _transformControls?: TransformControls;
  private _spriteMaterial: THREE.SpriteMaterial;
  private _raycaster: THREE.Raycaster;
  private _active: boolean;

  public get active(): boolean {
    return this._active;
  }

  public set active( value: boolean ) {
    this._active = value;

    this._sprites?.forEach( ( sprite ) => sprite.visible = value );
  }

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    const loader = new THREE.TextureLoader();
    const grabTexture = loader.load( imageGrabPurple, ( texture ) => {
      texture.flipY = false;
    } );

    this._spriteMaterial = new THREE.SpriteMaterial( {
      sizeAttenuation: false,
      transparent: true,
      depthTest: false,
      map: grabTexture,
    } );

    this._raycaster = new THREE.Raycaster();
    this._active = true;
  }

  public handleAfterSetup(): void {
    const { scene, camera, canvas } = this.inspector;

    this._transformControls = new TransformControls( camera, canvas );
    this._transformControls.space = 'local';
    this._transformControls.mode = 'rotate';
    scene.add( this._transformControls );

    this._transformControls.addEventListener( 'dragging-changed', ( event ) => {
      const cameraControls = this.inspector.cameraControlsPlugin.controls;
      if ( cameraControls ) {
        cameraControls.enabled = !event.value;
      }
    } );

    if ( canvas != null ) {
      canvas?.addEventListener( 'mousedown', ( event ) => this.handleMouseDown( event ) );
    }
  }

  public handleAfterLoad( model: InspectorModel ): void {
    const humanoid = model.vrm?.humanoid;
    if ( humanoid == null ) { return; }

    if ( humanoid ) {
      this._sprites = [];

      for ( const bone of Object.values( humanoid.humanBones ) ) {
        const boneNode = bone.node;

        const sprite = new THREE.Sprite( this._spriteMaterial );
        sprite.scale.setScalar( 0.01 );
        sprite.renderOrder = 10000;
        sprite.visible = this._active;
        boneNode.add( sprite );

        this._sprites.push( sprite );
      }
    }
  }

  public handleAfterUnload(): void {
    this._sprites = null;
    this._transformControls?.detach();
  }

  public handleMouseDown( event: MouseEvent ): void {
    const { camera, canvas } = this.inspector;
    if ( canvas == null ) { return; }

    const sprites = this._sprites;
    if ( sprites == null ) { return; }

    const transformControls = this._transformControls;
    if ( transformControls == null ) { return; }

    const rect = canvas.getBoundingClientRect();

    _v2A.set(
      ( event.clientX - rect.left ) / rect.width * 2.0 - 1.0,
      -( event.clientY - rect.top ) / rect.height * 2.0 + 1.0,
    );

    this._raycaster.setFromCamera( _v2A, camera );
    const isects = this._raycaster.intersectObjects( sprites, false );
    const isect = isects[ 0 ];

    const timeDown = Date.now();

    registerMouseEvent(
      () => 0,
      () => {
        const now = Date.now();
        if ( now - timeDown > 300 ) {
          return;
        }

        if ( isect != null ) {
          const sprite = isect.object as THREE.Sprite;
          const boneNode = sprite.parent!;

          transformControls.attach( boneNode );
        } else {
          transformControls.detach();
        }
      }
    );
  }
}
