interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_API_TOKEN: string
  readonly VITE_USE_MOCK?: string
  readonly VITE_MOCK_FAIL_RATE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
