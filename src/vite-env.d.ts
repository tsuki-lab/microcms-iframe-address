/* eslint-disable spaced-comment */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESAS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
