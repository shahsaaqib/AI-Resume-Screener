import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React specific
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // ✅ Disable strict TypeScript any rule globally
      "@typescript-eslint/no-explicit-any": "off",

      // Optionally: you can relax other common TS strict rules too
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      // Optional: stylistic
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
