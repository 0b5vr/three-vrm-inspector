import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { highlightNodes } from '../utils/highlightNodes';

export const highlightGLTFNode: HighlighterRuleFunction = async ({ index }, { parser }) => {
  const indexNum = parseInt(index, 10);

  const node = await parser.getDependency('node', indexNum) as THREE.Object3D;
  const callback = highlightNodes([node]);

  return () => {
    callback();
  };
};
