type Props = {
  arrowStart: boolean
  arrowEnd: boolean
  startTestId: string
  endTestId: string
  onToggleStart: (v: boolean) => void
  onToggleEnd: (v: boolean) => void
}

export function ArrowheadControl({
  arrowStart,
  arrowEnd,
  startTestId,
  endTestId,
  onToggleStart,
  onToggleEnd,
}: Props) {
  return (
    <svg viewBox="0 0 160 28" className="h-7 w-full">
      {/* Layer 1: Hitbox backgrounds */}
      <rect
        x="16"
        y="2"
        width="26"
        height="24"
        rx="4"
        fill={
          arrowStart
            ? 'color-mix(in srgb, var(--selection-color) 15%, transparent)'
            : 'var(--hitbox-inactive)'
        }
        className="pointer-events-none"
      />
      <rect
        x="118"
        y="2"
        width="26"
        height="24"
        rx="4"
        fill={
          arrowEnd
            ? 'color-mix(in srgb, var(--selection-color) 15%, transparent)'
            : 'var(--hitbox-inactive)'
        }
        className="pointer-events-none"
      />
      {/* Layer 2: Connecting line */}
      <line
        x1="24"
        y1="14"
        x2="136"
        y2="14"
        stroke="var(--selection-color)"
        strokeWidth="2"
        className="pointer-events-none"
      />
      {/* Layer 3: Arrowhead chevrons */}
      <polyline
        points="34,7 24,14 34,21"
        fill="none"
        stroke={arrowStart ? 'var(--selection-color)' : 'var(--inactive-color)'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none"
      />
      <polyline
        points="126,7 136,14 126,21"
        fill="none"
        stroke={arrowEnd ? 'var(--selection-color)' : 'var(--inactive-color)'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none"
      />
      {/* Layer 4: Interactive overlays */}
      <rect
        x="16"
        y="2"
        width="26"
        height="24"
        rx="4"
        fill="transparent"
        className="cursor-pointer hover:brightness-125"
        data-testid={startTestId}
        data-checked={arrowStart}
        onClick={() => onToggleStart(!arrowStart)}
      />
      <rect
        x="118"
        y="2"
        width="26"
        height="24"
        rx="4"
        fill="transparent"
        className="cursor-pointer hover:brightness-125"
        data-testid={endTestId}
        data-checked={arrowEnd}
        onClick={() => onToggleEnd(!arrowEnd)}
      />
    </svg>
  )
}
