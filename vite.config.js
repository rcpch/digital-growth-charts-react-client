import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    preserveSymlinks: command === "serve",
    alias: {
      // force this import to resolve to your local workspace copy
      "@rcpch/digital-growth-charts-react-component-library": path.resolve(
        __dirname,
        "..",
        "digital-growth-charts-react-component-library",
        "src"
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@rcpch/digital-growth-charts-react-component-library"],
  },
  server: {
    fs: {
      allow: [
        // your client root
        path.resolve(__dirname),
        // the linked library
        path.resolve(
          __dirname,
          "..",
          "digital-growth-charts-react-component-library"
        ),
      ],
    },
  },
}));
