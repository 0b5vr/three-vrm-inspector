import { Inspector } from '../../inspector/Inspector';
import { textureInfosAtom } from '../atoms/textureInfosAtom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { webglMemoryInfoAtom } from '../atoms/webglMemoryInfoAtom';

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
  useTextureInfosSubscriber( inspector );
  useWebGLMemoryInfoSubscriber( inspector );
}
