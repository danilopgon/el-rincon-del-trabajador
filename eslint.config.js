import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import astro from "eslint-plugin-astro";
import a11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default [
  // Base JS rules
  js.configs.recommended,

  // Global language options (browser environment)
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        console: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        Element: "readonly",
        HTMLElement: "readonly",
        Event: "readonly",
        KeyboardEvent: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
      },
    },
  },

  // TypeScript support
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: true },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // Astro support (includes its own parser + jsx-a11y-recommended for .astro)
  ...astro.configs["flat/recommended"],
  ...astro.configs["flat/jsx-a11y-recommended"],

  // jsx-a11y for .tsx / .jsx (React components)
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: { "jsx-a11y": a11y },
    rules: {
      ...a11y.configs.recommended.rules,
    },
  },

  // SonarJS (applied to all JS/TS/Astro files)
  {
    plugins: { sonarjs },
    rules: {
      // Required rules
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-nested-conditional": "warn",

      // Additional quality rules
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/prefer-single-boolean-return": "warn",
    },
  },

  // Disable ESLint rules that conflict with Prettier (formatting is handled by pnpm format)
  prettierConfig,

  // Ignored paths
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**"],
  },
];
