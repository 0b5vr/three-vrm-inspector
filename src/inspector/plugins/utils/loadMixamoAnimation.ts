import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { VRM } from '@pixiv/three-vrm';
import { mixamoVRMRigMap } from './mixamoVRMRigMap';

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

  const fbxHips = asset.children[ 0 ];
  const fbxHipsY = fbxHips.position.y;
  const vrmHips = humanoid.normalizedRestPose[ 'hips' ]!;
  const vrmHipsY = vrmHips.position![ 1 ];
  const hipsPositionScale = vrmHipsY / fbxHipsY;

  const clip = THREE.AnimationClip.findByName( asset.animations, 'mixamo.com' ); // AnimationClipを抽出する

  const tracks: THREE.KeyframeTrack[] = []; // VRM用のKeyframeTrackをこの配列に格納する

  clip.tracks.forEach( ( track ) => {
    // 各TrackをVRM向けに変換し、 `tracks` に格納する
    const trackSplitted = track.name.split( '.' );
    const mixamoRigName = trackSplitted[ 0 ];
    const vrmBoneName = mixamoVRMRigMap[ mixamoRigName ];

    if ( vrmBoneName != null ) {
      const vrmNodeName = humanoid.getNormalizedBoneNode( vrmBoneName )?.name;

      if ( vrmNodeName != null ) {
        const propertyName = trackSplitted[ 1 ];

        if ( track instanceof THREE.QuaternionKeyframeTrack ) {
          const trackValues = track.values.map( ( v, i ) => (
            vrm.meta?.metaVersion === '0' && i % 2 === 0 ? -v : v
          ) );

          tracks.push( new THREE.QuaternionKeyframeTrack(
            `${ vrmNodeName }.${ propertyName }`,
            track.times as any,
            trackValues as any,
          ) );
        } else if (
          vrmBoneName === 'hips' &&
          track instanceof THREE.VectorKeyframeTrack
        ) {
          const trackValues = track.values.map( ( v, i ) => (
            vrm.meta?.metaVersion === '0' && i % 3 !== 1 ? -v : v ) * hipsPositionScale
          );

          tracks.push( new THREE.VectorKeyframeTrack(
            `${ vrmNodeName }.${ propertyName }`,
            track.times as any,
            trackValues as any,
          ) );
        }
      }
    }
  } );

  return new THREE.AnimationClip( 'vrmAnimation', clip.duration, tracks );
}
