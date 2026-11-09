import { useParams } from "@tanstack/react-router"

export function useBuilderId() {
  const { buildId } = useParams({ from: "/(panel)/panel/builder/$buildId/" })
  return buildId
}
