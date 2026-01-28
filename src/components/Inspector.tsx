import { InspectorSection } from './InspectorSection'
import { InspectorField } from './InspectorField'
import { InspectorPanel } from './InspectorPanel'
import { ColorField } from './ColorField'
import { ArrowheadControl } from './ArrowheadControl'
import { useAppSelector, useAppDispatch } from '../hooks'
import { selectSelectedShapes } from '../store/selectors'
import { AppActions } from '../store/actions'
import type { RectShape, LineShape, TextShape } from '../store/state'
import { isLineShape, isTextShape } from '../utils'

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

  // Line inspector (simplified - only position and stroke)
  if (isLineShape(shape)) {
    const line = shape as LineShape
    return (
      <InspectorPanel title="Line">
        <InspectorSection title="Arrowheads" delay={50}>
          <ArrowheadControl
            arrowStart={!!line.arrowStart}
            arrowEnd={!!line.arrowEnd}
            startTestId="inspector-arrow-start-toggle"
            endTestId="inspector-arrow-end-toggle"
            onToggleStart={(v) =>
              dispatch(AppActions['line/arrowToggled'](line.id, 'start', v))
            }
            onToggleEnd={(v) =>
              dispatch(AppActions['line/arrowToggled'](line.id, 'end', v))
            }
          />
        </InspectorSection>
        <InspectorSection title="Stroke" delay={75} last>
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

  // Text inspector
  if (isTextShape(shape)) {
    const textShape = shape as TextShape
    return (
      <InspectorPanel title="Text">
        <InspectorSection title="Position" delay={50}>
          <div className="grid grid-cols-2 gap-2">
            <InspectorField
              label="X"
              value={String(textShape.x)}
              testId="inspector-x"
              inputTestId="inspector-x-input"
              onCommit={(v) =>
                dispatch(
                  AppActions['shape/positionChanged'](textShape.id, 'x', v)
                )
              }
            />
            <InspectorField
              label="Y"
              value={String(textShape.y)}
              testId="inspector-y"
              inputTestId="inspector-y-input"
              onCommit={(v) =>
                dispatch(
                  AppActions['shape/positionChanged'](textShape.id, 'y', v)
                )
              }
            />
          </div>
        </InspectorSection>

        <InspectorSection title="Size" delay={75}>
          <div className="grid grid-cols-2 gap-2">
            <InspectorField
              label="W"
              value={String(textShape.width)}
              testId="inspector-width"
              inputTestId="inspector-width-input"
              onCommit={(v) =>
                dispatch(
                  AppActions['shape/sizeChanged'](textShape.id, 'width', v)
                )
              }
            />
            <InspectorField
              label="H"
              value={String(textShape.height)}
              testId="inspector-height"
              inputTestId="inspector-height-input"
              onCommit={(v) =>
                dispatch(
                  AppActions['shape/sizeChanged'](textShape.id, 'height', v)
                )
              }
            />
          </div>
        </InspectorSection>

        <InspectorSection title="Font" delay={100}>
          <select
            data-testid="inspector-font-family-selector"
            value={
              textShape.fontFamily.charAt(0).toUpperCase() +
              textShape.fontFamily.slice(1)
            }
            onChange={(e) =>
              dispatch(
                AppActions['text/fontChanged'](
                  textShape.id,
                  e.target.value.toLowerCase() as 'serif' | 'sans' | 'mono'
                )
              )
            }
            className="w-full rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white"
          >
            <option value="Serif">Serif</option>
            <option value="Sans">Sans</option>
            <option value="Mono">Mono</option>
          </select>
        </InspectorSection>

        <InspectorSection title="Alignment" delay={125}>
          <div data-testid="inspector-alignment-buttons" className="flex gap-1">
            <button
              data-testid="inspector-alignment-left"
              data-active={textShape.align === 'left'}
              onClick={() =>
                dispatch(AppActions['text/alignChanged'](textShape.id, 'left'))
              }
              className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
            >
              Left
            </button>
            <button
              data-testid="inspector-alignment-center"
              data-active={textShape.align === 'center'}
              onClick={() =>
                dispatch(
                  AppActions['text/alignChanged'](textShape.id, 'center')
                )
              }
              className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
            >
              Center
            </button>
            <button
              data-testid="inspector-alignment-right"
              data-active={textShape.align === 'right'}
              onClick={() =>
                dispatch(AppActions['text/alignChanged'](textShape.id, 'right'))
              }
              className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
            >
              Right
            </button>
          </div>
        </InspectorSection>

        <InspectorSection title="Fill" delay={150} last>
          <ColorField
            value={textShape.fill}
            testId="inspector-fill"
            inputTestId="inspector-fill-input"
            onCommit={(v) =>
              dispatch(
                AppActions['shape/colorChanged'](textShape.id, 'fill', v)
              )
            }
          />
        </InspectorSection>
      </InspectorPanel>
    )
  }

  const rectShape = shape as RectShape
  const title = rectShape.type === 'ellipse' ? 'Ellipse' : 'Rectangle'
  const hasText = !!rectShape.text

  return (
    <InspectorPanel title={title}>
      {/* Position Section */}
      <InspectorSection title="Position" delay={50}>
        <div className="grid grid-cols-2 gap-2">
          <InspectorField
            label="X"
            value={String(rectShape.x)}
            testId="inspector-x"
            inputTestId="inspector-x-input"
            onCommit={(v) =>
              dispatch(
                AppActions['shape/positionChanged'](rectShape.id, 'x', v)
              )
            }
          />
          <InspectorField
            label="Y"
            value={String(rectShape.y)}
            testId="inspector-y"
            inputTestId="inspector-y-input"
            onCommit={(v) =>
              dispatch(
                AppActions['shape/positionChanged'](rectShape.id, 'y', v)
              )
            }
          />
        </div>
      </InspectorSection>

      {/* Size Section */}
      <InspectorSection title="Size" delay={75}>
        <div className="grid grid-cols-2 gap-2">
          <InspectorField
            label="W"
            value={String(rectShape.width)}
            testId="inspector-width"
            inputTestId="inspector-width-input"
            onCommit={(v) =>
              dispatch(
                AppActions['shape/sizeChanged'](rectShape.id, 'width', v)
              )
            }
          />
          <InspectorField
            label="H"
            value={String(rectShape.height)}
            testId="inspector-height"
            inputTestId="inspector-height-input"
            onCommit={(v) =>
              dispatch(
                AppActions['shape/sizeChanged'](rectShape.id, 'height', v)
              )
            }
          />
        </div>
      </InspectorSection>

      {/* Text Alignment - only shown when shape has text */}
      {hasText && (
        <InspectorSection title="Text Alignment" delay={100}>
          <div className="space-y-2">
            <div data-testid="inspector-halign-buttons" className="flex gap-1">
              <button
                data-testid="inspector-halign-left"
                data-active={rectShape.textAlign === 'left'}
                onClick={() =>
                  dispatch(
                    AppActions['shape/textHAlignChanged'](rectShape.id, 'left')
                  )
                }
                className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
              >
                Left
              </button>
              <button
                data-testid="inspector-halign-center"
                data-active={rectShape.textAlign === 'center'}
                onClick={() =>
                  dispatch(
                    AppActions['shape/textHAlignChanged'](
                      rectShape.id,
                      'center'
                    )
                  )
                }
                className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
              >
                Center
              </button>
              <button
                data-testid="inspector-halign-right"
                data-active={rectShape.textAlign === 'right'}
                onClick={() =>
                  dispatch(
                    AppActions['shape/textHAlignChanged'](rectShape.id, 'right')
                  )
                }
                className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
              >
                Right
              </button>
            </div>
            <div data-testid="inspector-valign-buttons" className="flex gap-1">
              <button
                data-testid="inspector-valign-top"
                data-active={rectShape.textVAlign === 'top'}
                onClick={() =>
                  dispatch(
                    AppActions['shape/textVAlignChanged'](rectShape.id, 'top')
                  )
                }
                className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
              >
                Top
              </button>
              <button
                data-testid="inspector-valign-middle"
                data-active={rectShape.textVAlign === 'middle'}
                onClick={() =>
                  dispatch(
                    AppActions['shape/textVAlignChanged'](
                      rectShape.id,
                      'middle'
                    )
                  )
                }
                className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
              >
                Middle
              </button>
              <button
                data-testid="inspector-valign-bottom"
                data-active={rectShape.textVAlign === 'bottom'}
                onClick={() =>
                  dispatch(
                    AppActions['shape/textVAlignChanged'](
                      rectShape.id,
                      'bottom'
                    )
                  )
                }
                className="flex-1 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm text-white data-[active=true]:bg-cyan-600"
              >
                Bottom
              </button>
            </div>
          </div>
        </InspectorSection>
      )}

      {/* Fill Section */}
      <InspectorSection title="Fill" delay={hasText ? 125 : 100}>
        <ColorField
          value={rectShape.fill}
          testId="inspector-fill"
          inputTestId="inspector-fill-input"
          onCommit={(v) =>
            dispatch(AppActions['shape/colorChanged'](rectShape.id, 'fill', v))
          }
        />
      </InspectorSection>

      {/* Stroke Section */}
      <InspectorSection title="Stroke" delay={hasText ? 150 : 125} last>
        <ColorField
          value={rectShape.stroke}
          testId="inspector-stroke"
          inputTestId="inspector-stroke-input"
          previewBorder
          onCommit={(v) =>
            dispatch(
              AppActions['shape/colorChanged'](rectShape.id, 'stroke', v)
            )
          }
        />
      </InspectorSection>
    </InspectorPanel>
  )
}
