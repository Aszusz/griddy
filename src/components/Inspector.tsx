import { InspectorSection } from './InspectorSection'
import { InspectorField } from './InspectorField'
import { InspectorPanel } from './InspectorPanel'
import { ColorField } from './ColorField'
import { useAppSelector, useAppDispatch } from '../hooks'
import { selectSelectedShapes } from '../store/selectors'
import { AppActions } from '../store/actions'

export function Inspector() {
  const selectedShapes = useAppSelector(selectSelectedShapes)
  const dispatch = useAppDispatch()

  if (selectedShapes.length === 0) {
    return null
  }

  if (selectedShapes.length > 1) {
    return (
      <InspectorPanel title="Selection">
        <div className="px-4 py-3">
          <span
            data-testid="inspector-multi-select-label"
            className="font-mono text-xs text-zinc-400"
          >
            {selectedShapes.length} shapes selected
          </span>
        </div>
      </InspectorPanel>
    )
  }

  const shape = selectedShapes[0]

  const title = shape.type === 'ellipse' ? 'Ellipse' : 'Rectangle'

  return (
    <InspectorPanel title={title}>
      {/* Position Section */}
      <InspectorSection title="Position" delay={50}>
        <div className="grid grid-cols-2 gap-2">
          <InspectorField
            label="X"
            value={String(shape.x)}
            testId="inspector-x"
            inputTestId="inspector-x-input"
            onCommit={(v) =>
              dispatch(AppActions['shape/positionChanged'](shape.id, 'x', v))
            }
          />
          <InspectorField
            label="Y"
            value={String(shape.y)}
            testId="inspector-y"
            inputTestId="inspector-y-input"
            onCommit={(v) =>
              dispatch(AppActions['shape/positionChanged'](shape.id, 'y', v))
            }
          />
        </div>
      </InspectorSection>

      {/* Size Section */}
      <InspectorSection title="Size" delay={75}>
        <div className="grid grid-cols-2 gap-2">
          <InspectorField
            label="W"
            value={String(shape.width)}
            testId="inspector-width"
            inputTestId="inspector-width-input"
            onCommit={(v) =>
              dispatch(AppActions['shape/sizeChanged'](shape.id, 'width', v))
            }
          />
          <InspectorField
            label="H"
            value={String(shape.height)}
            testId="inspector-height"
            inputTestId="inspector-height-input"
            onCommit={(v) =>
              dispatch(AppActions['shape/sizeChanged'](shape.id, 'height', v))
            }
          />
        </div>
      </InspectorSection>

      {/* Fill Section */}
      <InspectorSection title="Fill" delay={100}>
        <ColorField
          value={shape.fill}
          testId="inspector-fill"
          inputTestId="inspector-fill-input"
          onCommit={(v) =>
            dispatch(AppActions['shape/colorChanged'](shape.id, 'fill', v))
          }
        />
      </InspectorSection>

      {/* Stroke Section */}
      <InspectorSection title="Stroke" delay={125} last>
        <ColorField
          value={shape.stroke}
          testId="inspector-stroke"
          inputTestId="inspector-stroke-input"
          previewBorder
          onCommit={(v) =>
            dispatch(AppActions['shape/colorChanged'](shape.id, 'stroke', v))
          }
        />
      </InspectorSection>
    </InspectorPanel>
  )
}
