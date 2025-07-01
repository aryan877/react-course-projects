import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "dist/**"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "no-duplicate-imports": "error",
      "no-useless-return": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "brace-style": ["error", "1tbs"],
      "camelcase": ["error", { properties: "never" }],
      "consistent-return": "error",
      "no-param-reassign": "error",
      "no-shadow": "error",
      "prefer-destructuring": ["error", {
        "array": true,
        "object": true
      }],
    },
  },
]; 