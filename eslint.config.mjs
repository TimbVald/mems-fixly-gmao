import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/prefer-const": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-css-tags": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-head-element": "off",
      "@next/next/no-head-element": "off",
      "@typescript-eslint/no-explicit-any": "off",

      
      // React rules
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      
      // General rules
      "no-console": "off",
      "no-debugger": "off",
      "no-unused-expressions": "off",
      "prefer-const": "off",
      "no-var": "off",
      
      // Import rules
      "import/no-unused-modules": "off",
      "import/order": [
        "off",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always"
        }
      ]
    }
  }
];

export default eslintConfig;
