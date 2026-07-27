import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    extends: [
      eslintJs.configs.recommended,
      eslintReact.configs["recommended-typescript"],
    ],
  },
);
