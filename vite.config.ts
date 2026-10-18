import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vite.dev/config/
// `vite build --mode share` makes one self-contained HTML file (scripts, styles,
// fonts and images inlined) for a private preview link; scripts/share-inline.mjs
// then inlines the live site's /media images too.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === "share" ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build:
    mode === "share"
      ? { outDir: "dist-share", assetsInlineLimit: Number.MAX_SAFE_INTEGER, copyPublicDir: false }
      : {},
}))
