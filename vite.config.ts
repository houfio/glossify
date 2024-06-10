import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      future: {
        unstable_singleFetch: true
      },
      presets: [
        vercelPreset()
      ]
    }),
    tsconfigPaths(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: [
          '@babel/preset-typescript'
        ],
        plugins: [
          ['babel-plugin-react-compiler', {}]
        ]
      }
    })
  ],
  define: {
    __VERSION__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) ?? 'develop')
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
