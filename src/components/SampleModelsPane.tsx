import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { SampleModelsPaneButton } from './SampleModelsPaneButton';
import seedSanVrm from '../assets/models/Seed-san.vrm';
import threeVrmGirlVrm from '../assets/models/three-vrm-girl.vrm';
import vrm1ConstraintTwistSampleVrm from '../assets/models/VRM1_Constraint_Twist_Sample.vrm';

// == models =======================================================================================
const models = [
  { name: 'three-vrm-girl (VRM0.0)', url: threeVrmGirlVrm },
  { name: 'Seed-san (VRM1.0)', url: seedSanVrm },
  { name: 'VRM1_Constaint_Twist_Sample (VRM1.0)', url: vrm1ConstraintTwistSampleVrm },
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
