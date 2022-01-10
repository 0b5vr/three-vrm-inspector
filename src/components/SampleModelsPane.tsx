import { Pane, PaneParams } from './Pane';
import { SampleModelsPaneButton } from './SampleModelsPaneButton';
import threeVrmGirlVrm from '../assets/models/three-vrm-girl.vrm';
import threeVrmGirlVrm00Vrm from '../assets/models/three-vrm-girl-vrm0.0.vrm';
import { PaneRoot } from './PaneRoot';

// == models =======================================================================================
const models = [
  { name: 'three-vrm-girl (VRM0.X)', url: threeVrmGirlVrm00Vrm },
  { name: 'three-vrm-girl (VRM1.0-beta)', url: threeVrmGirlVrm },
];

// == element ======================================================================================
export const SampleModelsPane = ( params: PaneParams ): JSX.Element => {
  return (
    <Pane { ...params }>
      <PaneRoot>
        { models.map( ( { name, url } ) => (
          <SampleModelsPaneButton
            key={ name }
            name={ name }
            url={ url }
          />
        ) ) }
      </PaneRoot>
    </Pane>
  );
};
