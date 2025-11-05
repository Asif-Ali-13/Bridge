/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CELO_BRIDGE: string;
  readonly VITE_CELO_TOKEN: string;
  // add more variables if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
