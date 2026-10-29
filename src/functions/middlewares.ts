import { createMiddleware } from "@tanstack/react-start"
import { ensureSession } from "@/functions/auth"

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await ensureSession()

    return next({
      context: { session },
    })
  }
)

export const adminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ context, next }) => {
    if (context.session.user.role !== "ADMIN") {
      throw new Error("Forbidden")
    }

    return next()
  })
