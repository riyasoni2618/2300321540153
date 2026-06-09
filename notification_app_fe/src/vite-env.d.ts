/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_AUTHORIZATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
