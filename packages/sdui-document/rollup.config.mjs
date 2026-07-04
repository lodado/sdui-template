import { defaultConfig } from 'rollup-config/rollup.config.mjs';

const config = defaultConfig().map((rollupConfig) => ({
  ...rollupConfig,
  treeshake: false,
}));

export default config;
