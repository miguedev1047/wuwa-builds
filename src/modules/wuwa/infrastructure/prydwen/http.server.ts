import { execFile } from "node:child_process"

/**
 * prydwen.gg sits behind Cloudflare, which answers Node's `fetch` with a 403
 * ("Just a moment...") based on its TLS fingerprint. curl with a browser
 * User-Agent gets the real HTML, so it is used as transport.
 *
 * Server-only on purpose: this is the scraping adapter, never shipped to the
 * browser.
 */
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"

const MAX_BUFFER = 32 * 1024 * 1024

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))

export function fetchPage(url: string): Promise<string> {
  return new Promise((done, fail) => {
    execFile(
      "curl",
      [
        "-sSL",
        "--compressed",
        "--max-time",
        "60",
        "-H",
        `User-Agent: ${USER_AGENT}`,
        "-H",
        "Accept: */*",
        url,
      ],
      { encoding: "utf8", maxBuffer: MAX_BUFFER },
      (error, stdout, stderr) => {
        if (error) {
          fail(new Error(`curl failed for ${url}: ${stderr || error.message}`))
          return
        }

        if (!stdout || stdout.length < 1000) {
          fail(new Error(`Empty response for ${url}`))
          return
        }

        if (stdout.includes("Just a moment...")) {
          fail(new Error(`Cloudflare challenge for ${url}`))
          return
        }

        done(stdout)
      }
    )
  })
}

export async function fetchPageWithRetry(
  url: string,
  attempts = 3
): Promise<string> {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetchPage(url)
    } catch (error) {
      lastError = error
      if (attempt < attempts) await sleep(1000 * attempt)
    }
  }

  throw lastError
}
