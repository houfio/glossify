import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '../../node_modules/.vite',
  plugins: [
    react()
  ]
});
