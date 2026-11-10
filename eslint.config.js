import { plugin as shadcn } from "@shadcn/lint"
import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
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
    ],
    languageOptions: {
      globals: globals.browser,
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
      "shadcn/no-arbitrary-values": "warn",
      "shadcn/no-inline-styles": "error",
      "shadcn/require-static-classes": "warn",
      "shadcn/no-unknown-classes": "error",
    },
  },
  // These files intentionally bridge React state with external systems: the
  // dock runs an animation loop with refs, while the theme, image and media
  // hooks resync after mount. The compiler rules are advisory here.
  {
    files: [
      "src/components/ui/dock.tsx",
      "src/components/ui/image.tsx",
      "src/hooks/use-mobile.ts",
      "src/providers/theme-provider/theme-provider.tsx",
    ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
])
