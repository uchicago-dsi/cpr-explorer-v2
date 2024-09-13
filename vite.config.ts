import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),

    // visualizer({
    //   template: "treemap", // or sunburst
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: "analyze.html", // will be saved in project's root
    // })
  ],
  define: {
    "procces.env": {
      VITE_DATA_ENDOINT: "",
    },
  },
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"],
  },
});
