import { Link } from './Link';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';

export const AboutPane = ( params: PaneParams ): JSX.Element => {
  return (
    <Pane { ...params }>
      <PaneRoot>
        <div>three-vrm-inspector</div>
        <div>Three.js based VRM inspector</div>
        <div>Source: <Link widthClass="w-min" href="https://github.com/0b5vr/three-vrm-inspector" /></div>
      </PaneRoot>
    </Pane>
  );
};
