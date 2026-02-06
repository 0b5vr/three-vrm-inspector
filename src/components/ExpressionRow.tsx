import { useCallback, useContext } from 'react';
import { InspectorContext } from '../InspectorContext';
import { RangeRow } from './RangeRow';

export function ExpressionRow({
  name,
  isAvailable,
}: {
  name: string;
  isAvailable: boolean;
}) {
  const { inspector } = useContext(InspectorContext);

  const handleChange = useCallback(
    (value: number) => {
      inspector.model?.vrm?.expressionManager?.setValue(name, value);
    },
    [inspector.model?.vrm?.expressionManager, name],
  );

  return (
    <RangeRow label={name} disabled={!isAvailable} onChange={handleChange} />
  );
}
