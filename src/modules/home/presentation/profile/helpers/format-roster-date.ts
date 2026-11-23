const rosterDateFormat = new Intl.DateTimeFormat("es", {
  dateStyle: "medium",
  timeZone: "UTC",
})

/** Formats a saved build's update date consistently on the server and client. */
export function formatRosterDate(value: string) {
  return rosterDateFormat.format(new Date(value))
}
