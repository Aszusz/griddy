import type { LucideIcon } from 'lucide-react'

type Option<T extends string> = {
  value: T
  icon: LucideIcon
  label: string
}

type Props<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  testIdPrefix: string
}

export function AlignmentButtonGroup<T extends string>({
  value,
  onChange,
  options,
  testIdPrefix,
}: Props<T>) {
  return (
    <div
      data-testid={`${testIdPrefix}-buttons`}
      className="bg-input/50 border-border inline-flex gap-0.5 rounded-lg border p-0.5"
    >
      {options.map(({ value: optionValue, icon: Icon, label }) => {
        const isActive = value === optionValue
        return (
          <button
            key={optionValue}
            data-testid={`${testIdPrefix}-${optionValue}`}
            data-active={isActive}
            onClick={() => onChange(optionValue)}
            className={`group relative flex h-8 w-10 items-center justify-center rounded-md transition-all duration-150 ease-out ${
              isActive
                ? 'bg-selection/15 text-selection shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            } `}
            title={label}
            aria-label={`Align ${label.toLowerCase()}`}
            aria-pressed={isActive}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2.5 : 2}
              className={`transition-all duration-150 ${isActive ? 'scale-105' : 'group-hover:scale-105'} `}
            />
            {isActive && (
              <span
                className="bg-selection absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full opacity-60"
                style={{ animation: 'fadeSlideIn 150ms ease-out' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
