import { Input } from "@/components/panelui/input"
import { MAX_BUILD_NAME_LENGTH } from "@build/domain/build"
import { useDebouncer } from "@tanstack/react-pacer"
import { useRef, useState } from "react"

const RENAME_DELAY_MS = 500

type BuildNameProps = {
  /** Current name from the build collection. */
  name: string
  /** Commits a valid name to the build. */
  onRename: (name: string) => void
  /** Focuses the field when the header enters editing mode. */
  autoFocus?: boolean
}

/** Editable name of the current build. */
export function BuildName({ name, onRename, autoFocus }: BuildNameProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const composing = useRef(false)

  const rename = useDebouncer(onRename, {
    wait: RENAME_DELAY_MS,
    onUnmount: (debouncer) => debouncer.flush(),
  })

  const changeName = (value: string) => {
    setDraft(value)

    const nextName = value.trim()
    if (composing.current || !nextName || nextName === name) {
      rename.cancel()
      return
    }

    rename.maybeExecute(nextName)
  }

  return (
    <Input
      autoFocus={autoFocus}
      value={draft ?? name}
      aria-label="Nombre de la build"
      placeholder="Nombre de la build"
      maxLength={MAX_BUILD_NAME_LENGTH}
      onChange={(event) => changeName(event.currentTarget.value)}
      onCompositionStart={() => {
        composing.current = true
        rename.cancel()
      }}
      onCompositionEnd={(event) => {
        composing.current = false
        changeName(event.currentTarget.value)
      }}
      onBlur={() => {
        rename.flush()
        setDraft(null)
      }}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing || composing.current) return

        if (event.key === "Enter" || event.key === "Escape") {
          event.preventDefault()
          event.currentTarget.blur()
        }
      }}
    />
  )
}
