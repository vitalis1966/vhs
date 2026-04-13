import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: false,
  },
  ssr: {
    // Bundle these into SSR so browser polyfills in main.tsx run before they evaluate
    noExternal: ['react-router-dom', '@remix-run/router', '@supabase/supabase-js', '@supabase/gotrue-js', '@supabase/postgrest-js', '@supabase/realtime-js', '@supabase/storage-js', '@supabase/functions-js'],
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    modulePreload: { polyfill: false },
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
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
