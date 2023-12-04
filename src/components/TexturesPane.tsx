import { Hr } from './Hr';
import { InspectorContext } from '../InspectorContext';
import { InspectorTexturesPluginInfo } from '../inspector/plugins/InspectorTexturesPlugin';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { bytesToDisplayBytes } from './utils/bytesToDisplayBytes';
import { useContext, useMemo } from 'react';

// == microcomponents ==============================================================================
const Texture = ( { textureInfo }: {
  textureInfo: InspectorTexturesPluginInfo;
} ): JSX.Element => {
  const description = useMemo( () => (
    `${ textureInfo.width }x${ textureInfo.height }, ${ bytesToDisplayBytes( textureInfo.byteLength ) }`
  ), [ textureInfo ] );

  return (
    <div className="flex items-center">
      <div className="flex-grow">
        <div className="text-sm">{ textureInfo.name }</div>
        <div className="text-xs text-gray-400">{ textureInfo.mimeType }</div>
        <div className="text-xs text-gray-400">{ description }</div>
      </div>
    </div>
  );
};

// == element ======================================================================================
export const TexturesPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const texturesPlugin = inspector.texturesPlugin;
  const textureInfos = texturesPlugin.textureInfos;

  const count = useMemo( () => (
    textureInfos?.length ?? 0
  ), [ textureInfos ] );

  const totalBytes = useMemo( () => (
    textureInfos?.reduce( ( total, textureInfo ) => (
      total + textureInfo.byteLength
    ), 0 ) ?? 0
  ), [ textureInfos ] );

  const totalPixels = useMemo( () => (
    textureInfos?.reduce( ( total, textureInfo ) => (
      total + textureInfo.width * textureInfo.height
    ), 0 ) ?? 0
  ), [ textureInfos ] );
  const totalPixelsDisplay = useMemo( () => (
    `${ totalPixels.toLocaleString() } pixels (≈ ${ Math.sqrt( totalPixels ).toFixed( 0 ).toLocaleString() }^2)`
  ), [ totalPixels ] );

  return (
    <Pane { ...params }>
      <PaneRoot
        className="w-80 h-96 overflow-y-scroll resize"
      >
        <div>Textures count: { count }</div>
        <div>Total size: { bytesToDisplayBytes( totalBytes ) }</div>
        <div>Total pixels: { totalPixelsDisplay }</div>

        <Hr />

        { textureInfos != null && (
          <div className="flex flex-col gap-1">
            { textureInfos.map( ( textureInfo, i ) => (
              <Texture
                key={ i }
                textureInfo={ textureInfo }
              />
            ) ) }
          </div>
        ) }
      </PaneRoot>
    </Pane>
  );
};
