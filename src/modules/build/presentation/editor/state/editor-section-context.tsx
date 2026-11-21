import type { BuildEditorSection } from "@build/domain/build-record"
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type EditorSectionValue = {
  section: BuildEditorSection
  setSection: (section: BuildEditorSection) => void
}

const EditorSectionContext = createContext<EditorSectionValue | null>(null)

/**
 * Screen state of the open editor: which section the rail shows.
 *
 * It is not part of the saved build, so it stays in memory and resets when the
 * editor mounts for another build.
 */
export function EditorSectionProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<BuildEditorSection>("resonator")
  const value = useMemo(() => ({ section, setSection }), [section])

  return <EditorSectionContext value={value}>{children}</EditorSectionContext>
}

/** Active editor section and its setter. */
export function useEditorSection(): EditorSectionValue {
  const value = useContext(EditorSectionContext)
  if (!value) throw new Error("EditorSectionProvider is required")

  return value
}
