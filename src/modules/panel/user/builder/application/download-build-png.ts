/** Capture a fully rendered build card and download it as a PNG in the browser. */
export async function downloadBuildPng(card: HTMLDivElement, name: string) {
  const images = Array.from(card.querySelectorAll("img"))

  await Promise.all([
    document.fonts.ready,
    ...images.map((image) => {
      image.loading = "eager"
      return image.decode()
    }),
  ])

  const { toBlob } = await import("html-to-image")
  const png = await toBlob(card, {
    pixelRatio: 2,
    preferredFontFormat: "woff2",
    includeQueryParams: true,
  })

  if (!png) throw new Error("PNG capture returned no image")

  const fileName =
    name
      .trim()
    .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/[. ]+$/, "") || "build"
  const url = URL.createObjectURL(png)
  const download = document.createElement("a")
  download.href = url
  download.download = `${fileName}.png`
  document.body.appendChild(download)

  try {
    download.click()
  } finally {
    download.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
