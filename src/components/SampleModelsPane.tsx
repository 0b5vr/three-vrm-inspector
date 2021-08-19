import { Pane, PaneParams } from './Pane';
import { Colors } from '../constants/Colors';
import React from 'react';
import { SampleModelsPaneButton } from './SampleModelsPaneButton';
import styled from 'styled-components';
import threeVrmGirlVrm from '../assets/models/three-vrm-girl.vrm';
import threeVrmGirlVrm00Vrm from '../assets/models/three-vrm-girl-vrm0.0.vrm';

// == models =======================================================================================
const models = [
  { name: 'three-vrm-girl (VRM0.X)', url: threeVrmGirlVrm00Vrm },
  { name: 'three-vrm-girl (VRM1.0-beta)', url: threeVrmGirlVrm },
];

// == styles =======================================================================================
const Root = styled.div`
  padding: 8px;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
`;

// == element ======================================================================================
export const SampleModelsPane = ( params: PaneParams ): JSX.Element => {
  return (
    <Pane { ...params }>
      <Root>
        { models.map( ( { name, url } ) => (
          <SampleModelsPaneButton
            key={ name }
            name={ name }
            url={ url }
          />
        ) ) }
      </Root>
    </Pane>
  );
};
