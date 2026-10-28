import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/wuwa-resonators")({
  server: {
    handlers: {
      GET: async () => {},
    },
  },
})
