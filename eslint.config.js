import js from "@eslint/js";
import react from "@eslint-react/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "dist-ssr/**",
      "node_modules/**",
      ".npm-cache/**",
      "tmp/**",
      "verification/**",
    ],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@eslint-react": react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      "@eslint-react/no-missing-key": "error",
      "@eslint-react/no-duplicate-key": "error",
      "@eslint-react/jsx-no-comment-textnodes": "error",
      "@eslint-react/jsx-no-children-prop": "error",
      "@eslint-react/jsx-no-namespace": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='ref'][value.type='Literal']",
          message:
            "Use a ref object or callback instead of a legacy string ref.",
        },
      ],
      "@eslint-react/no-direct-mutation-state": "error",
      "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": "error",
      "@eslint-react/dom-no-unsafe-target-blank": "error",
      "@eslint-react/dom-no-unknown-property": "error",
    },
  },
];
