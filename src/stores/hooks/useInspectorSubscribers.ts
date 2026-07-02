import { Inspector } from '../../inspector/Inspector';
import { expressionsAtom, expressionValuesAtom } from '../atoms/expressionsAtom';
import { statsAtom } from '../atoms/statsAtom';
import { textureInfosAtom } from '../atoms/textureInfosAtom';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { webglMemoryInfoAtom } from '../atoms/webglMemoryInfoAtom';
import type { InspectorModel } from '../../inspector/InspectorModel';

function useStatsSubscriber(inspector: Inspector): void {
  const setStats = useSetAtom(statsAtom);

  useEffect(() => {
    inspector.statsPlugin.on('update', ({ stats }) => {
      setStats(stats);
    });
  }, [inspector]);
}

function useTextureInfosSubscriber(inspector: Inspector): void {
  const setTextureInfos = useSetAtom(textureInfosAtom);

  useEffect(() => {
    inspector.texturesPlugin.on('updateTextureInfos', ({ textureInfos }) => {
      setTextureInfos(textureInfos);
    });
  }, [inspector]);
}

function useWebGLMemoryInfoSubscriber(inspector: Inspector): void {
  const setWebGLMemoryInfo = useSetAtom(webglMemoryInfoAtom);

  useEffect(() => {
    inspector.webglMemoryPlugin.on('update', ({ webGLMemoryInfo }) => {
      setWebGLMemoryInfo(webGLMemoryInfo);
    });
  }, [inspector]);
}

function useExpressionsSubscriber(inspector: Inspector): void {
  const setExpressions = useSetAtom(expressionsAtom);
  const setExpressionValues = useSetAtom(expressionValuesAtom);

  useEffect(() => {
    const updateExpressions = (model: InspectorModel | null): void => {
      const expressionMap = model?.vrm?.expressionManager?.expressionMap;
      const expressions = expressionMap ? Object.keys(expressionMap) : null;
      setExpressions(expressions);

      const expressionValues: Record<string, number> = {};
      for (const name of expressions ?? []) {
        expressionValues[name] = model?.vrm?.expressionManager?.getValue(name) ?? 0.0;
      }
      setExpressionValues(expressionValues);
    };

    const handleLoad = (model: InspectorModel | null): void => {
      updateExpressions(model);
    };

    const handleUnload = (): void => {
      updateExpressions(null);
    };

    inspector.on('load', handleLoad);
    inspector.on('unload', handleUnload);
    updateExpressions(inspector.model);

    return () => {
      inspector.off('load', handleLoad);
      inspector.off('unload', handleUnload);
    };
  }, [inspector, setExpressions, setExpressionValues]);
}

export function useInspectorSubscribers(inspector: Inspector): void {
  useStatsSubscriber(inspector);
  useTextureInfosSubscriber(inspector);
  useWebGLMemoryInfoSubscriber(inspector);
  useExpressionsSubscriber(inspector);
}
