interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
