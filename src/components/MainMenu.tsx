import { Menu, Undo2, Redo2, Save, FolderOpen, Image } from 'lucide-react'
import { useAppDispatch, useAppSelector, useFileOperations } from '../hooks'
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
  const {
    fileInputRef,
    showConfirm,
    errorMessage,
    handleSave,
    handleOpenClick,
    handleFileChange,
    handleConfirm,
    handleCancel,
    clearError,
    handleExportPng,
  } = useFileOperations()

  return (
    <div
      className="animate-in fade-in slide-in-from-top-2 fixed top-4 left-4 z-50 duration-300"
      style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

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

          <DropdownMenuItem
            onClick={handleSave}
            data-testid="menu-item-save"
            className="group gap-3 rounded-lg px-3 py-2 text-zinc-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-zinc-100"
          >
            <Save className="size-[18px] text-zinc-500 transition-colors group-data-[highlighted]:text-zinc-300" />
            <span className="flex-1 text-[13px]">Save</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleOpenClick}
            data-testid="menu-item-open"
            className="group gap-3 rounded-lg px-3 py-2 text-zinc-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-zinc-100"
          >
            <FolderOpen className="size-[18px] text-zinc-500 transition-colors group-data-[highlighted]:text-zinc-300" />
            <span className="flex-1 text-[13px]">Open</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleExportPng}
            data-testid="menu-item-export-png"
            className="group gap-3 rounded-lg px-3 py-2 text-zinc-300 transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-zinc-100"
          >
            <Image className="size-[18px] text-zinc-500 transition-colors group-data-[highlighted]:text-zinc-300" />
            <span className="flex-1 text-[13px]">Export PNG</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showConfirm && (
        <div
          data-testid="confirm-load-dialog"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        >
          <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <p className="mb-4 text-zinc-300">
              Loading will replace current canvas. Continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                data-testid="cancel-load-button"
                onClick={handleCancel}
                className="rounded-lg px-4 py-2 text-zinc-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-load-button"
                onClick={handleConfirm}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          data-testid="file-error-message"
          className="fixed top-20 left-4 z-[100] rounded-lg border border-red-500/30 bg-red-900/90 px-4 py-2 text-red-200"
        >
          {errorMessage}
          <button
            onClick={clearError}
            className="ml-4 text-red-400 hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
