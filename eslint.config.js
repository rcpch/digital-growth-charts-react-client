import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['build/**', 'dist/**', 'node_modules/**'],
    extends: [
      eslintJs.configs.recommended,
      eslintReact.configs["recommended"],
    ],
    languageOptions: {
			globals: {
				...globals.browser,
      },
      parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
      },
		},
  },
  {
    files: ["vite.config.js"],
    languageOptions: {
			globals: {
				...globals.node,
			},
		},
  }
]);
