import { plugin as shadcn } from "@shadcn/lint"
import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores([
    "dist",
    ".tanstack",
    ".wrangler",
    ".agents",
    "src/app/routeTree.gen.ts",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  // @shadcn/lint: https://github.com/shadcn-ui/lint#rules
  // src/components/ui/** holds CLI-managed primitives that intentionally use
  // arbitrary values; app code is where these rules matter.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    plugins: { shadcn },
    rules: {
      "shadcn/no-restyle": [
        "warn",
        {
          allow: ["layout"],
          contracts: [
            {
              pattern:
                "^Card(Header|CardContainer|CardBody|Content|Footer|Title|Description)?$",
              allow: [
                "layout",
                "w-full",
                "mt-*",
                "mb-*",
                "p-*",
                "pt-*",
                "pb-*",
                "gap-*",
                "transition-*",
                "duration-*",
              ],
            },
            {
                  pattern: "^Button$",
              allow: [
                "layout",
                "w-*",
                "size-*",
                "mt-*",
                "mb-*",
                "my-*",
                "mx-*",
                "ml-*",
                "mr-*",
                "shrink-*",
                "grow-*",
                "gap-*",
                "self-*",
                "cursor-*",
                "select-*",
                "opacity-*",
                "group-*",
                "transition-*",
              ],
            },
          ],
        },
      ],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-inline-styles": "error",
      "shadcn/require-static-classes": "error",
      "shadcn/no-unknown-classes": "error",
    },
  },
])
