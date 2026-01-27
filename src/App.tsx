import { Canvas } from './components/Canvas'
import { Toolbox } from './components/Toolbox'
import { Inspector } from './components/Inspector'
import { StatusBar } from './components/StatusBar'
import { MainMenu } from './components/MainMenu'
import { useKeyboardShortcuts } from './hooks'

function App() {
  useKeyboardShortcuts()

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <Canvas />
      <MainMenu />
      <Toolbox />
      <Inspector />
      <StatusBar />
    </div>
  )
}

export default App
