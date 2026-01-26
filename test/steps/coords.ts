type BoundingBox = { x: number; y: number; width: number; height: number }

export function modelToBrowser(
  modelX: number,
  modelY: number,
  box: BoundingBox
) {
  const originX = box.width / 2
  const originY = box.height / 2
  return { x: box.x + originX + modelX, y: box.y + originY + modelY }
}

export function browserToModel(
  browserX: number,
  browserY: number,
  box: BoundingBox
) {
  const originX = box.width / 2
  const originY = box.height / 2
  return { x: browserX - box.x - originX, y: browserY - box.y - originY }
}
