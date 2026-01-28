import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { AlignmentButtonGroup } from './AlignmentButtonGroup'

type TextAlign = 'left' | 'center' | 'right'

const options = [
  { value: 'left' as const, icon: AlignLeft, label: 'Left' },
  { value: 'center' as const, icon: AlignCenter, label: 'Center' },
  { value: 'right' as const, icon: AlignRight, label: 'Right' },
]

type Props = {
  value: TextAlign
  onChange: (value: TextAlign) => void
  testIdPrefix?: string
}

export function TextAlignmentControl({
  value,
  onChange,
  testIdPrefix = 'inspector-alignment',
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
