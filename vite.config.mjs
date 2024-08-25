import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    remix(),
    sentryVitePlugin({
      org: "daily-habits-ben-coe-test-orga",
      project: "javascript-react",
      reactComponentAnnotation: {
        enabled: true
      }
    }),
  ],

  build: {
    sourcemap: true
  }
});
