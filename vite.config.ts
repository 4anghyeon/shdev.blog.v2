import contentCollections from "@content-collections/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  build: {
    rollupOptions: {
      external: ["/pagefind/pagefind.js"],
    },
  },
  optimizeDeps: {
    include: ["echo-text", "es-toolkit"],
  },
  ssr: {
    noExternal: ["echo-text", "es-toolkit"],
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => !path.includes("#"),
      },
    }),
    nitro(),
    contentCollections(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});

export default config;
