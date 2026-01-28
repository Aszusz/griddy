import {
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from 'lucide-react'
import { AlignmentButtonGroup } from './AlignmentButtonGroup'

type VerticalAlign = 'top' | 'middle' | 'bottom'

const options = [
  { value: 'top' as const, icon: AlignVerticalJustifyStart, label: 'Top' },
  {
    value: 'middle' as const,
    icon: AlignVerticalJustifyCenter,
    label: 'Middle',
  },
  {
    value: 'bottom' as const,
    icon: AlignVerticalJustifyEnd,
    label: 'Bottom',
  },
]

type Props = {
  value: VerticalAlign
  onChange: (value: VerticalAlign) => void
  testIdPrefix?: string
}

export function VerticalAlignmentControl({
  value,
  onChange,
  testIdPrefix = 'inspector-valign',
}: Props) {
  return (
    <AlignmentButtonGroup
      value={value}
      onChange={onChange}
      options={options}
      testIdPrefix={testIdPrefix}
    />
  )
}
