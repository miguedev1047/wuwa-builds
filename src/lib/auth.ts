import * as schema from "@/db/schemas/auth-schema"

import { db } from "@/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2"
import { tanstackStartCookies } from "better-auth/tanstack-start"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: false,
  },

  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },

  plugins: [tanstackStartCookies()],
})
