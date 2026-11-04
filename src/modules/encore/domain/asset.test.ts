/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { encoreAssetUrl } from "./asset"

describe("encoreAssetUrl", () => {
  test("keeps absolute URLs untouched", () => {
    const url =
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconWeapon/T_IconWeapon21010074_UI.webp"

    expect(encoreAssetUrl(url)).toBe(url)
  })

  test("drops the API segment Encore prefixes to absolute asset URLs", () => {
    expect(
      encoreAssetUrl(
        "https://api-v2.encore.moe/api/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconMonsterGoods/T_IconMonsterGoods_988_UI.webp"
      )
    ).toBe(
      "https://api-v2.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconMonsterGoods/T_IconMonsterGoods_988_UI.webp"
    )
  })

  test("turns an Unreal asset path into a fetchable URL", () => {
    const assetPath =
      "/Game/Aki/UI/UIResources/Common/Image/IconWeapon/T_IconWeapon21010074_UI.T_IconWeapon21010074_UI"

    expect(encoreAssetUrl(assetPath)).toBe(
      "https://api-v2.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconWeapon/T_IconWeapon21010074_UI.webp"
    )
  })

  test("does not double the extension on a relative path", () => {
    expect(
      encoreAssetUrl(
        "/Game/Aki/UI/UIResources/Common/Image/IconWeapon/T_IconWeapon21010074_UI.webp"
      )
    ).toBe(
      "https://api-v2.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconWeapon/T_IconWeapon21010074_UI.webp"
    )
  })

  test("returns an empty string for missing icons", () => {
    expect(encoreAssetUrl()).toBe("")
    expect(encoreAssetUrl("")).toBe("")
    expect(encoreAssetUrl(null)).toBe("")
  })
})
