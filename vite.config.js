import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  base: getBasePath(),
});
