import { InspectorContext } from '../InspectorContext';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { RangeRow } from './RangeRow';
import { useCallback, useContext } from 'react';

export const LightsPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );

  const handleChangeAzimuth = useCallback( ( value: number ) => {
    inspector.lightsPlugin.directionalLightAzimuth = 2.0 * Math.PI * value;
  }, [ inspector ] );

  const handleChangeAltitude = useCallback( ( value: number ) => {
    inspector.lightsPlugin.directionalLightAltitude = Math.PI * ( value - 0.5 );
  }, [ inspector ] );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <div>Directional Light</div>
        <RangeRow
          label="Azimuth"
          onChange={ handleChangeAzimuth }
        />
        <RangeRow
          label="Altitude"
          defaultValue={ 0.5 }
          onChange={ handleChangeAltitude }
        />
      </PaneRoot>
    </Pane>
  );
};
