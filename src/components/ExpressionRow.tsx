import { InspectorContext } from '../InspectorContext';
import { RangeRow } from './RangeRow';
import { expressionValuesAtom } from '../stores/atoms/expressionsAtom';
import { useCallback, useContext } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

export function ExpressionRow({ name, isAvailable }: {
  name: string;
  isAvailable: boolean;
}) {
  const { inspector } = useContext(InspectorContext);
  const value = useAtomValue(expressionValuesAtom)[name] ?? 0.0;
  const setExpressionValues = useSetAtom(expressionValuesAtom);

  const handleChange = useCallback(
    (value: number) => {
      setExpressionValues((currentExpressionValues) => ({
        ...currentExpressionValues,
        [name]: value,
      }));

      inspector.model?.vrm?.expressionManager?.setValue(name, value);
    },
    [inspector, name, setExpressionValues],
  );

  return (
    <RangeRow
      label={name}
      value={value}
      disabled={!isAvailable}
      onChange={handleChange}
    />
  );
}
