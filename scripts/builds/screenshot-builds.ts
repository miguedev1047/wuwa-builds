import { mkdir, readFile, readdir } from "node:fs/promises"
import { join } from "node:path"
import { Database } from "bun:sqlite"
import { chromium } from "playwright-core"
import { makeSignature } from "better-auth/crypto"

const D1_DIR = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject"
const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3100"
const OUT_DIR = "builds/screenshots"
const STORAGE_FILE = ".tmp/builds/local-builds.json"
const CHROMIUM_PATH = process.env.CHROMIUM_PATH ?? "/usr/bin/chromium"

interface LocalBuild {
  data: {
    buildId: string
    name: string
    resonator: { data: { name: string } | null }
  }
}

function findDatabaseFile(files: string[]): string {
  const file = files.find(
    (name) => name.endsWith(".sqlite") && name !== "metadata.sqlite"
  )

  if (!file) throw new Error("No local D1 database file found")

  return join(D1_DIR, file)
}

async function sessionToken(): Promise<string> {
  const files = await readdir(D1_DIR)
  const db = new Database(findDatabaseFile(files), { readonly: true })
  const row = db
    .query(
      "select token from session where expires_at > (cast(unixepoch('subsecond')*1000 as integer)) order by expires_at desc limit 1"
    )
    .get() as { token: string } | null

  db.close()

  if (!row) throw new Error("No active session in the local D1 database")

  return row.token
}

async function main() {
  const storage = JSON.parse(await readFile(STORAGE_FILE, "utf8")) as Record<
    string,
    LocalBuild
  >
  const token = await sessionToken()
  const secret = process.env.BETTER_AUTH_SECRET

  if (!secret) throw new Error("BETTER_AUTH_SECRET is not set")

  const signature = await makeSignature(token, secret)
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    args: ["--no-sandbox"],
  })
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  await context.addCookies([
    {
      name: "better-auth.session_token",
      value: `${token}.${signature}`,
      url: BASE_URL,
      httpOnly: true,
      sameSite: "Lax",
    },
  ])

  await page.goto(`${BASE_URL}/panel/my-builds`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  })
  await page.evaluate((value) => {
    localStorage.setItem("builds", value)
    localStorage.setItem("theme", "dark")
  }, JSON.stringify(storage))

  await mkdir(OUT_DIR, { recursive: true })

  page.on("pageerror", (error) => {
    console.error("pageerror", error.message)
  })

  const builds = Object.values(storage)
    .map((entry) => entry.data)
    .sort((left, right) =>
      (left.resonator.data?.name ?? "").localeCompare(
        right.resonator.data?.name ?? ""
      )
    )

  for (const build of builds) {
    const character = build.resonator.data?.name ?? build.name
    const slug = character.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    await page.goto(`${BASE_URL}/panel/builder/${build.buildId}`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    })
    await page.addStyleTag({
      content:
        '#react-scan-root, [data-testid="tanstack_devtools"], div.bottom-3.right-3 { display: none !important }',
    })
    await page.waitForTimeout(2500)
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images]
          .filter((image) => !image.complete)
          .map(
            (image) =>
              new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true })
                image.addEventListener("error", () => resolve(), { once: true })
              })
          )
      )
    })

    await page.screenshot({
      path: join(OUT_DIR, `${slug}.png`),
      fullPage: true,
    })

    const canvas = page.locator(".build-canvas")

    if ((await canvas.count()) > 0) {
      await canvas.screenshot({ path: join(OUT_DIR, `${slug}-canvas.png`) })
    }

    console.log(`Captured ${character} -> ${slug}.png`)
  }

  await browser.close()
  console.log(`Screenshots in ${OUT_DIR}`)
}

await main()
