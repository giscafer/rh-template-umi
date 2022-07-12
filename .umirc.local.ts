import { defineConfig } from '@umijs/max';
import proxy from './proxy';

export const mfsu = {};

export default defineConfig({
  define: {
    MOCK: true,
  },
  mfsu,
  proxy: proxy[process.env.NODE_ENV || 'development'],
});
