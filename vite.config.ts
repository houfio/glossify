import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  define: {
    __VERSION__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) ?? 'develop')
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
