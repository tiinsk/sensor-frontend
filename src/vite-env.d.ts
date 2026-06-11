/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROUTE: string;
  readonly VITE_API_PROXY_ROUTE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
