import { Menu, Undo2, Redo2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppActions } from '../store/actions'
import { selectCanUndo, selectCanRedo } from '../store/selectors'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function MainMenu() {
  const dispatch = useAppDispatch()
  const canUndo = useAppSelector(selectCanUndo)
  const canRedo = useAppSelector(selectCanRedo)

  return (
    <div
      className="animate-in fade-in slide-in-from-top-2 fixed top-4 left-4 z-50 duration-300"
      style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-zinc-900/95 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-200 hover:border-white/12 hover:bg-zinc-800/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            data-testid="main-menu-trigger"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent" />
            <Menu className="relative size-[18px] text-zinc-400 transition-colors duration-200 group-hover:text-zinc-200" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="min-w-[180px] border-white/8 bg-zinc-900/98 shadow-2xl shadow-black/50 backdrop-blur-2xl"
        >
          <DropdownMenuItem
            onClick={() => dispatch(AppActions['history/undo']())}
            disabled={!canUndo}
            className="group gap-3 rounded-lg px-3 py-2 text-zinc-300 transition-colors data-[disabled]:text-zinc-600 data-[highlighted]:bg-white/5 data-[highlighted]:text-zinc-100"
          >
            <Undo2 className="size-[18px] text-zinc-500 transition-colors group-data-[highlighted]:text-zinc-300" />
            <span className="flex-1 text-[13px]">Undo</span>
            <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => dispatch(AppActions['history/redo']())}
            disabled={!canRedo}
            className="group gap-3 rounded-lg px-3 py-2 text-zinc-300 transition-colors data-[disabled]:text-zinc-600 data-[highlighted]:bg-white/5 data-[highlighted]:text-zinc-100"
          >
            <Redo2 className="size-[18px] text-zinc-500 transition-colors group-data-[highlighted]:text-zinc-300" />
            <span className="flex-1 text-[13px]">Redo</span>
            <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 bg-white/5" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
