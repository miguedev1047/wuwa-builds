import { Input } from "@/components/ui/input"

/** Editable name of the current build. */
export function BuildName({
  name,
  onRename,
}: {
  name: string
  onRename: (name: string) => void
}) {
  return (
    <Input
      value={name}
      aria-label="Nombre de la build"
      className="w-full text-xl placeholder:text-xl"
      placeholder="Nombre de la build"
      onChange={(event) => onRename(event.target.value)}
    />
  )
}
