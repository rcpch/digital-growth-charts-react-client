import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

function getBasePath() {
  // When deploying to GitHub pages it's served under a subdomain
  // https://rcpch.github.io/digital-growth-charts-react-client/
  //
  // GITHUB_REPOSITORY is the full name: rcpch/digital-growth-charts-react-client

  if (process.env["GITHUB_REPOSITORY"]) {
    const [, repoName] = process.env["GITHUB_REPOSITORY"].split("/");

    if (repoName) {
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

export default defineConfig(({ command, mode }) => ({
  base: getBasePath(),
  plugins: [react()],
  resolve: {
    preserveSymlinks: command === "serve",
    alias: isLocalDev
      ? {
          // Only use the local path alias in development when the folder exists
          "@rcpch/digital-growth-charts-react-component-library": path.resolve(
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
}));
