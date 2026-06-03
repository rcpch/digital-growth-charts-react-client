/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import process from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getBasePath() {
  // Prefer explicit env (set in CI), else derive from GitHub context
  const fromEnv = process.env.BASE_PATH;
  if (fromEnv) return fromEnv.endsWith("/") ? fromEnv : fromEnv + "/";

  const repo = process.env.GITHUB_REPOSITORY; // e.g. "rcpch/digital-growth-charts-react-client"
  if (repo) {
    const [, repoName] = repo.split("/");
    if (repoName) {
      // User/Org pages repo (rcpch.github.io) should use root "/"
      if (repoName.endsWith(".github.io")) return "/";
      return `/${repoName}/`;
    }
  }
  return "/";
}

// Check if we're in a local development environment with the library available
const isLocalDev =
  process.env.NODE_ENV === "development" &&
  fs.existsSync(
    path.resolve(
      __dirname,
      "..",
      "digital-growth-charts-react-component-library"
    )
  );

export default defineConfig(() => {
  const base = getBasePath();
  return {
    base,
    plugins: [react()],
    css: {
      preprocessorOptions: {
        less: {
          math: "always",
          // expose base to Less so theme.config/site variables can build correct URLs
          modifyVars: {
            basePath: `${base}`, // e.g. "/digital-growth-charts-react-client/"
          },
        },
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: isLocalDev
        ? {
            "@rcpch/digital-growth-charts-react-component-library":
              path.resolve(
                __dirname,
                "..",
                "digital-growth-charts-react-component-library",
                "src"
              ),
          }
        : {},
    },
    optimizeDeps: {
      exclude: isLocalDev
        ? ["@rcpch/digital-growth-charts-react-component-library"]
        : [],
    },
    server: {
      ...(process.env.DOCKER ? { host: true } : {}),
      fs: {
        allow: [
          path.resolve(__dirname),
          ...(isLocalDev
            ? [
                path.resolve(
                  __dirname,
                  "..",
                  "digital-growth-charts-react-component-library"
                ),
              ]
            : []),
        ],
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      outDir: "dist",
    },
  };
});
