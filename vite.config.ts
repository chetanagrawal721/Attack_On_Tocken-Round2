import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()],
  // polling = no fs.watch handles, so copying big media files into public/media can never crash the dev server,
  // and newly added files are picked up immediately
  server: { watch: { usePolling: true, interval: 400, ignored: ['**/proof/**', '**/test-results/**', '**/node_modules/**'] } }, test: { include: ['tests/unit/**/*.test.ts'] } });
