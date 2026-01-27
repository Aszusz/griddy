import { Canvas } from './components/Canvas'
import { Toolbox } from './components/Toolbox'
import { Inspector } from './components/Inspector'
import { StatusBar } from './components/StatusBar'
import { useKeyboardShortcuts } from './hooks'

function App() {
  useKeyboardShortcuts()

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <Canvas />
      <Toolbox />
      <Inspector />
      <StatusBar />
    </div>
  )
}

export default App
