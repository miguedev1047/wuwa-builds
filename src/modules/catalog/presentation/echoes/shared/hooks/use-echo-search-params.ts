import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useCallback } from "react"

/** URL backed state for the echo picker search and filters. */
export function useEchoSearchParams() {
  const [echoName, setEchoName] = useQueryState(
    "echo_name",
    parseAsString.withOptions({ history: "replace" })
  )
  const [echoSet, setEchoSet] = useQueryState(
    "echo_set",
    parseAsInteger.withOptions({ history: "replace" })
  )
  const [echoCost, setEchoCost] = useQueryState(
    "echo_cost",
    parseAsInteger.withOptions({ history: "replace" })
  )
  const [echoClass, setEchoClass] = useQueryState(
    "echo_class",
    parseAsInteger.withOptions({ history: "replace" })
  )

  const clearSearchParams = useCallback(() => {
    void setEchoName(null)
    void setEchoSet(null)
    void setEchoCost(null)
    void setEchoClass(null)
  }, [setEchoClass, setEchoCost, setEchoName, setEchoSet])

  return {
    clearSearchParams,
    echoName,
    echoSet,
    echoCost,
    echoClass,
    setEchoName,
    setEchoSet,
    setEchoCost,
    setEchoClass,
  }
}
