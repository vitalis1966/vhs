import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

const nonBlockingCSS = (): Plugin => ({
  name: 'non-blocking-css',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet"([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*?)>/g,
      (_m, before, href, after) =>
        `<link rel="preload" as="style"${before}href="${href}"${after} onload="this.onload=null;this.rel='stylesheet'">` +
        `<noscript><link rel="stylesheet"${before}href="${href}"${after}></noscript>`
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    nonBlockingCSS(),
    ...(process.env.ANALYZE === 'true' ? [
      visualizer({
        open: false,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    ] : []),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome61',
    cssMinify: true,
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['lucide-react'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
}));
