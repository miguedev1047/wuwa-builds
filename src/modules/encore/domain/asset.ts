/**
 * Encore serves the same artwork in two shapes:
 *
 * - Absolute URLs, mostly in list endpoints and character payloads:
 *   `https://api.encore.moe/resource/Data/.../T_IconWeapon21010074_UI.webp`
 * - Unreal asset paths, mostly in detail endpoints (weapons, echo `IconBig`):
 *   `/Game/.../T_IconWeapon21010074_UI.T_IconWeapon21010074_UI`
 *
 * An asset path is `PackagePath.ObjectName`, not a file path: the segment after
 * the dot is the object inside the package, so the fetchable URL is the host
 * plus the package path plus `.webp`.
 */
const ASSET_HOST = "https://api-v2.encore.moe/resource/Data"
const ASSET_EXTENSION = ".webp"

/**
 * The list endpoints now prefix absolute asset URLs with the API segment, which
 * serves the SPA fallback (`text/html`) instead of the image. The CDN path has
 * no `/api`, so absolute URLs are normalized before they reach an `<img>`.
 */
const API_ASSET_PREFIX = "https://api-v2.encore.moe/api/resource"
const ASSET_PREFIX = "https://api-v2.encore.moe/resource"

export function encoreAssetUrl(value?: string | null): string {
  if (!value) {
    return ""
  }

  if (/^https?:\/\//i.test(value)) {
    return value.replace(API_ASSET_PREFIX, ASSET_PREFIX)
  }

  // Anything that is not rooted in the asset host is not an Unreal package
  // path; leave it alone instead of inventing a URL.
  if (!value.startsWith("/")) {
    return value
  }

  const packagePath = value.replace(/\.[^./]+$/, "")

  return `${ASSET_HOST}${packagePath}${ASSET_EXTENSION}`
}
