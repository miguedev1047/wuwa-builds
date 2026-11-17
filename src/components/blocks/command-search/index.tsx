import { Command } from "@/components/panelui/command"
import { CommandSearchRoot } from "@/components/blocks/command-search/command-search-root"
import {
  CommandSearchFilterContent,
  CommandSearchFilterTrigger,
  CommandSearchLoading,
} from "@/components/blocks/command-search/components/command-search-parts"

/** Compound Command dialog for search, selection and optional filters. */
export const CommandSearch = {
  Root: CommandSearchRoot,
  Input: Command.Input,
  List: Command.List,
  Empty: Command.Empty,
  Group: Command.Group,
  Item: Command.Item,
  Separator: Command.Separator,
  FilterTrigger: CommandSearchFilterTrigger,
  FilterContent: CommandSearchFilterContent,
  Loading: CommandSearchLoading,
} as const

export type { CommandSearchRootProps } from "@/components/blocks/command-search/command-search-root"
