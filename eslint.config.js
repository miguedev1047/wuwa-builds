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
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-restyle": [
        "warn",
        {
          allow: ["layout"],
          contracts: [
            {
              pattern: "^Breadcrumb(Page|Item)?$",
              allow: [
                "layout",
                "truncate",
                "block",
                "max-w-*",
                "sm:max-w-*",
                "md:max-w-*",
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
            {
              pattern:
                "^Card(Header|Container|Body|Content|Footer|Title|Description)?$",
              allow: [
                "layout",
                "w-full",
                "truncate",
                "mt-*",
                "mb-*",
                "p-*",
                "gap-*",
                "bg-*",
                "transition-*",
                "duration-*",
                "border",
                "border-*",
                "shadow-*",
              ],
            },
            {
              pattern: "^Badge$",
              allow: [
                "layout",
                "w-*",
                "text-*",
                "shrink-*",
                "self-*",
                "cursor-*",
              ],
            },
            {
              pattern: "^Empty(Header|Media|Title|Description|Content)?$",
              allow: [
                "layout",
                "max-w-*",
                "w-full",
                "ease-in-out",
                "transition",
                "my-*",
                "py-*",
                "text-*",
                "border-*",
                "backdrop-blur-*",
                "border",
                "gap-*",
              ],
            },
            {
              pattern: "^Skeleton$",
              allow: [
                "layout",
                "w-*",
                "h-*",
                "size-*",
                "rounded-*",
                "opacity-*",
                "aspect-*",
                "flex-*",
                "relative",
                "shrink-*",
              ],
            },
            {
              pattern: "^Spinner$",
              allow: ["layout", "size-*", "text-*", "shrink-*"],
            },
            {
              pattern: "^Separator$",
              allow: [
                "layout",
                "size-*",
                "text-*",
                "shrink-*",
                "border",
                "border-*",
                "bg-*",
              ],
            },
            {
              pattern: "^BuildCard$",
              allow: [
                "layout",
                "size-*",
                "text-*",
                "border",
                "shadow-*",
                "border-*",
                "bg-*",
              ],
            },
            {
              pattern: "^Tabs(Content|List|Trigger)?$",
              allow: [
                "layout",
                "w-*",
                "gap-*",
                "p-*",
                "pt-*",
                "pb-*",
                "mt-*",
                "mb-*",
                "space-y-*",
              ],
            },
            {
              pattern: "^Table(Header|Body|Footer|Row|Head|Cell)?$",
              allow: [
                "layout",
                "w-*",
                "h-*",
                "gap-*",
                "hidden",
                "flex",
                "items-*",
                "justify-*",
                "p-*",
                "px-*",
                "py-*",
              ],
            },
            {
              pattern: "^Dialog(Content|Header|Footer|Title|Description)?$",
              allow: [
                "layout",
                "max-w-*",
                "w-full",
                "gap-*",
                "p-*",
                "px-*",
                "py-*",
              ],
            },
            {
              pattern: "^Sheet(Content|Header|Footer|Title|Description)?$",
              allow: [
                "layout",
                "w-*",
                "max-w-*",
                "gap-*",
                "p-*",
                "px-*",
                "py-*",
              ],
            },
            {
              pattern: "^Popover(Trigger|Content)?$",
              allow: ["layout", "w-*", "min-w-*", "max-w-*", "p-*", "gap-*"],
            },
            {
              pattern:
                "^DropdownMenu(Trigger|Content|Item|Label|Separator|Group)?$",
              allow: [
                "layout",
                "w-*",
                "min-w-*",
                "max-w-*",
                "gap-*",
                "text-*",
                "cursor-*",
              ],
            },
            {
              pattern: "^Dialog(Trigger|Content|Header|Description)?$",
              allow: [
                "layout",
                "w-*",
                "outline-*",
                "min-w-*",
                "max-w-*",
                "gap-*",
                "text-*",
                "cursor-*",
              ],
            },
            {
              pattern: "^ContextMenu(Content|Item|Label|Separator|Group)?$",
              allow: [
                "layout",
                "w-*",
                "min-w-*",
                "max-w-*",
                "gap-*",
                "text-*",
                "cursor-*",
              ],
            },
            {
              pattern:
                "^Item(Group|Separator|Media|Content|Title|Description|Actions|Header|Footer)?$",
              allow: [
                "layout",
                "w-*",
                "shrink-*",
                "gap-*",
                "space-y-*",
                "space-x-*",
                "space-*",
                "cursor-*",
              ],
            },
            {
              pattern:
                "^Command(Dialog|Input|List|VirtualList|Empty|Group|Item|Separator|Shortcut)?$",
              allow: ["layout", "w-*", "max-w-*", "h-*", "gap-*"],
            },
            {
              pattern: "^Alert(Title|Description|Action)?$",
              allow: ["layout", "w-full", "gap-*", "my-*", "mt-*", "mb-*"],
            },
            {
              pattern:
                "^AlertDialog(Content|Header|Footer|Title|Description|Action|Cancel)?$",
              allow: ["layout", "gap-*", "w-*", "max-w-*"],
            },
            { pattern: "^Input$", allow: ["layout", "w-full", "text-*"] },
            { pattern: "^Textarea$", allow: ["layout", "w-full", "min-h-*"] },
            { pattern: "^Label$", allow: ["layout", "text-*"] },
            {
              pattern:
                "^Sidebar(Header|Content|Footer|Group|Menu|MenuItem|MenuButton|MenuBadge|MenuSub|Rail|Trigger|Inset)?$",
              allow: [
                "layout",
                "bg-*",
                "flex-*",
                "min-w-*",
                "min-h-*",
                "overflow-*",
                "backdrop-blur-*",
                "gap-*",
                "p-*",
                "px-*",
                "py-*",
                "border-*",
              ],
            },
            {
              pattern: "^Field(Label|Content|Description|Group)?$",
              allow: [
                "layout",
                "bg-*",
                "border",
                "rounded-*",
                "flex-*",
                "min-w-*",
                "min-h-*",
                "overflow-*",
                "backdrop-blur-*",
                "gap-*",
                "p-*",
                "px-*",
                "py-*",
                "border-*",
              ],
            },
            {
              pattern: "^Tooltip(Content|Trigger)?$",
              allow: [
                "layout",
                "gap-*",
                "opacity-*",
                "grayscale",
                "grayscale-*",
              ],
            },
            { pattern: "^RadioGroup(Item)?$", allow: ["layout", "gap-*"] },
            { pattern: "^Image$", allow: ["layout", "gap-*", "opacity-*"] },
            {
              pattern: "^Collapsible(Content|Button)?$",
              allow: [
                "layout",
                "w-*",
                "text-*",
                "pr-*",
                "px-*",
                "pl-*",
                "tabular-nums",
                "uppercase",
                "font-*",
                "gap-*",
                "flex-*",
                "h-*",
                "self-*",
                "min-w-*",
              ],
            },
            {
              pattern: "^InputGroup(Input|Addon|Button)?$",
              allow: [
                "layout",
                "w-*",
                "text-*",
                "pr-*",
                "pl-*",
                "tabular-nums",
                "uppercase",
                "font-*",
                "gap-*",
                "flex-*",
                "h-*",
                "self-*",
                "min-w-*",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/ui/**"],
    rules: {
      "shadcn/no-restyle": "off",
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
  // The build canvas is a read-only surface: it paints the build but never
  // opens an editor, a picker or writes to the local collection.
  {
    files: ["src/modules/panel/user/builder/components/build-canvas/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@builds/client/build-store",
              message:
                "The canvas reads the build; edits belong to an editor section.",
            },
            {
              name: "@builder/ui/build-card-section",
              importNames: ["BuildCardSectionDialog", "BuildCardTrigger"],
              message:
                "The canvas has no triggers; dialogs belong to an editor section.",
            },
            {
              name: "@builder/ui/build-catalog-picker",
              importNames: ["BuildCatalogPickerDialog"],
              message:
                "The canvas has no pickers; they belong to an editor section.",
            },
          ],
        },
      ],
    },
  },
  // PanelUI components are copied from the registry and keep its styling and
  // ref conventions; the project-specific component rules do not apply.
  {
    files: ["src/components/panelui/**"],
    rules: {
      "shadcn/no-arbitrary-values": "off",
      "shadcn/no-restyle": "off",
      "react-hooks/refs": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
])
