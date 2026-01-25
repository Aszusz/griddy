export type Effects = {
  log: (message: string) => void
  now: () => Date
}

export const defaultEffects: Effects = {
  log: console.log.bind(console),
  now: () => new Date(),
}
