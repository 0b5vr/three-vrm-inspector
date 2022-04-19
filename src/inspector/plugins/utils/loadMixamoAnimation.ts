import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { VRM } from '@pixiv/three-vrm';
import { arrayChunk } from '../..//utils/arrayChunk';
import { computeWorldSpaceRestPose } from '../../utils/computeWorldSpaceRestPose';
import { mixamoVRMRigMap } from './mixamoVRMRigMap';

const _quatA = new THREE.Quaternion();
const _quatB = new THREE.Quaternion();
const _quatC = new THREE.Quaternion();
const _quatD = new THREE.Quaternion();
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();

/**
 * Load Mixamo animation, modify for the given VRM and return it.
 * @param url URL of Mixamo animation
 * @param vrm The VRM model
 * @returns AnimationClip
 */
export async function loadMixamoAnimation(
  url: string,
  vrm: VRM,
): Promise<THREE.AnimationClip | null> {
  const humanoid = vrm.humanoid;
  if ( humanoid == null ) { return null; }

  const loader = new FBXLoader(); // FBXを読み込むLoader

  const asset = await loader.loadAsync( url );

  const clip = THREE.AnimationClip.findByName( asset.animations, 'mixamo.com' ); // AnimationClipを抽出する

  const tracks: THREE.KeyframeTrack[] = []; // VRM用のKeyframeTrackをこの配列に格納する

  const worldSpaceRestPose = computeWorldSpaceRestPose( vrm );

  clip.tracks.forEach( ( track ) => {
    // 各TrackをVRM向けに変換し、 `tracks` に格納する
    const trackSplitted = track.name.split( '.' );
    const mixamoRigName = trackSplitted[ 0 ];
    const vrmBoneName = mixamoVRMRigMap[ mixamoRigName ];

    if ( vrmBoneName != null ) {
      const rawRestTransform = humanoid.restPose[ vrmBoneName ];
      const worldSpaceRestTransform = worldSpaceRestPose?.[ vrmBoneName ];
      const vrmNodeName = humanoid.getBoneNode( vrmBoneName )?.name;

      if ( vrmNodeName != null ) {
        const propertyName = trackSplitted[ 1 ];

        const rawRestPosition = rawRestTransform?.position ?? [ 0.0, 0.0, 0.0 ];
        const restPosition = _v3A.fromArray( rawRestPosition );
        let positionScale = 0.01;
        if ( vrmBoneName === 'hips' ) {
          positionScale *= restPosition.length();
          restPosition.multiplyScalar( 0.0 );
        }

        const rawRestRotation = rawRestTransform?.rotation ?? [ 0.0, 0.0, 0.0, 1.0 ];
        const restRotation = _quatA.fromArray( rawRestRotation );
        const rawWorldParentRotation = worldSpaceRestTransform?.rotation ?? [ 0.0, 0.0, 0.0, 1.0 ];
        const worldParentRotation = _quatB.fromArray( rawWorldParentRotation )
          .multiply( restRotation );
        const invWorldParentRotation = _quatC.copy( worldParentRotation ).invert();

        if ( track instanceof THREE.QuaternionKeyframeTrack ) {
          tracks.push( new THREE.QuaternionKeyframeTrack(
            `${ vrmNodeName }.${ propertyName }`,
            track.times as any,
            arrayChunk( track.values, 4 ).flatMap( ( v ) => (
              _quatD.fromArray( v )
                .multiply( worldParentRotation )
                .premultiply( invWorldParentRotation )
                .multiply( restRotation )
                .toArray()
            ) )
          ) );
        } else if ( track instanceof THREE.VectorKeyframeTrack ) {
          tracks.push( new THREE.VectorKeyframeTrack(
            `${ vrmNodeName }.${ propertyName }`,
            track.times as any,
            arrayChunk( track.values, 3 ).flatMap( ( v ) => (
              _v3B.fromArray( v )
                .applyQuaternion( invWorldParentRotation )
                .multiplyScalar( positionScale )
                .add( restPosition )
                .toArray()
            ) )
          ) );
        }
      }
    }
  } );

  return new THREE.AnimationClip( 'vrmAnimation', clip.duration, tracks );
}
