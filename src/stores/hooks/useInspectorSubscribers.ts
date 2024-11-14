import { Inspector } from '../../inspector/Inspector';
import { statsAtom } from '../atoms/statsAtom';
import { textureInfosAtom } from '../atoms/textureInfosAtom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { webglMemoryInfoAtom } from '../atoms/webglMemoryInfoAtom';

function useStatsSubscriber( inspector: Inspector ): void {
  const setStats = useSetAtom( statsAtom );

  useEffect( () => {
    inspector.statsPlugin.on( 'update', ( { stats } ) => {
      setStats( stats );
    } );
  }, [ inspector ] );
}

function useTextureInfosSubscriber( inspector: Inspector ): void {
  const setTextureInfos = useSetAtom( textureInfosAtom );

  useEffect( () => {
    inspector.texturesPlugin.on( 'updateTextureInfos', ( { textureInfos } ) => {
      setTextureInfos( textureInfos );
    } );
  }, [ inspector ] );
}

function useWebGLMemoryInfoSubscriber( inspector: Inspector ): void {
  const setWebGLMemoryInfo = useSetAtom( webglMemoryInfoAtom );

  useEffect( () => {
    inspector.webglMemoryPlugin.on( 'update', ( { webGLMemoryInfo } ) => {
      setWebGLMemoryInfo( webGLMemoryInfo );
    } );
  }, [ inspector ] );
}

export function useInspectorSubscribers( inspector: Inspector ): void {
  useStatsSubscriber( inspector );
  useTextureInfosSubscriber( inspector );
  useWebGLMemoryInfoSubscriber( inspector );
}
