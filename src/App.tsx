import { Canvas } from './components/Canvas'
import { Toolbox } from './components/Toolbox'
import { Inspector } from './components/Inspector'
import { useKeyboardShortcuts } from './hooks'

function App() {
  useKeyboardShortcuts()

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <Canvas />
      <Toolbox />
      <Inspector />
    </div>
  )
}

export default App
