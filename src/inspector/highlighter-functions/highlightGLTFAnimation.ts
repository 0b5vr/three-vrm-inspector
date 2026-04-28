import { HighlighterRuleFunction } from '../Highlighter';

export const highlightGLTFAnimation: HighlighterRuleFunction = (
  { index },
  { inspector },
) => {
  const plugin = inspector.animationPlugin;

  const indexNum = parseInt(index, 10);
  const clip = plugin.gltfAnimations?.[indexNum];
  if (!clip) { return () => {}; }

  plugin.loadAnimation({
    type: 'gltf',
    clip,
  });

  return () => plugin.clearAnimation();
}
