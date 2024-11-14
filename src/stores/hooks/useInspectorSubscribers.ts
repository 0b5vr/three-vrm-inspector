import { Inspector } from '../../inspector/Inspector';
import { textureInfosAtom } from '../atoms/textureInfosAtom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

function useTextureInfosSubscriber( inspector: Inspector ): void {
  const setTextureInfos = useSetAtom( textureInfosAtom );

  useEffect( () => {
    inspector.texturesPlugin.on( 'updateTextureInfos', ( { textureInfos } ) => {
      setTextureInfos( textureInfos );
    } );
  }, [ inspector ] );
}

export function useInspectorSubscribers( inspector: Inspector ): void {
  useTextureInfosSubscriber( inspector );
}
