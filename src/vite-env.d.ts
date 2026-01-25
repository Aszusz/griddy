/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_HARNESS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
