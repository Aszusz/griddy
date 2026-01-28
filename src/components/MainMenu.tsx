import {
  Menu,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Image,
  Link,
  FilePlus,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react'
import {
  useAppDispatch,
  useAppSelector,
  useFileOperations,
  useTheme,
} from '../hooks'
import type { Theme } from '../hooks'
import { AppActions } from '../store/actions'
import { selectCanUndo, selectCanRedo } from '../store/selectors'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './ui/dropdown-menu'

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function MainMenu() {
  const dispatch = useAppDispatch()
  const canUndo = useAppSelector(selectCanUndo)
  const canRedo = useAppSelector(selectCanRedo)
  const { theme, setTheme } = useTheme()
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
    handleCopyLink,
    handleNew,
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
            className="group border-border bg-card hover:bg-accent relative flex h-10 w-10 items-center justify-center rounded-xl border shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            data-testid="main-menu-trigger"
          >
            <div className="absolute inset-0 hidden rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent dark:block" />
            <Menu className="text-muted-foreground group-hover:text-foreground relative size-[18px] transition-colors duration-200" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="border-border bg-popover min-w-[180px] shadow-2xl shadow-black/50 backdrop-blur-2xl"
        >
          <DropdownMenuItem
            onClick={() => dispatch(AppActions['history/undo']())}
            disabled={!canUndo}
            className="group text-popover-foreground data-[disabled]:text-muted-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <Undo2 className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">Undo</span>
            <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => dispatch(AppActions['history/redo']())}
            disabled={!canRedo}
            className="group text-popover-foreground data-[disabled]:text-muted-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <Redo2 className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">Redo</span>
            <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border my-1.5" />

          <DropdownMenuItem
            onClick={handleNew}
            data-testid="menu-item-new"
            className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <FilePlus className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">New</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSave}
            data-testid="menu-item-save"
            className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <Save className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">Save</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleOpenClick}
            data-testid="menu-item-open"
            className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <FolderOpen className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">Open</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleExportPng}
            data-testid="menu-item-export-png"
            className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <Image className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">Export PNG</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyLink}
            data-testid="menu-item-copy-link"
            className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <Link className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
            <span className="flex-1 text-[13px]">Copy Link</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border my-1.5" />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              data-testid="menu-item-theme"
              className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
            >
              <Sun className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
              <span className="flex-1 text-[13px]">Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="border-border bg-popover min-w-[140px] shadow-2xl shadow-black/50 backdrop-blur-2xl">
              {themeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  data-testid={`menu-item-theme-${opt.value}`}
                  className="group text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground gap-3 rounded-lg px-3 py-2 transition-colors"
                >
                  <opt.icon className="text-muted-foreground group-data-[highlighted]:text-popover-foreground size-[18px] transition-colors" />
                  <span className="flex-1 text-[13px]">{opt.label}</span>
                  {theme === opt.value && (
                    <Check className="size-4 text-cyan-400" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {showConfirm && (
        <div
          data-testid="confirm-load-dialog"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        >
          <div className="border-border bg-card rounded-xl border p-6 shadow-2xl">
            <p className="text-foreground mb-4">
              Loading will replace current canvas. Continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                data-testid="cancel-load-button"
                onClick={handleCancel}
                className="text-muted-foreground hover:bg-accent rounded-lg px-4 py-2"
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
