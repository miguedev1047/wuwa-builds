import { expect, test } from "bun:test"
import { CATALOG_NOT_FOUND } from "@catalog/domain/catalog-error"
import { catalogResource } from "@/routing/catalog/catalog-resource"
import { isNotFound } from "@tanstack/react-router"

test("preserves successful catalog values", async () => {
  const value = { id: 1 }
  expect(await catalogResource(Promise.resolve(value))).toBe(value)
})

test("maps missing catalog resources to a route 404", async () => {
  const error = await catalogResource(
    Promise.reject(new Error(CATALOG_NOT_FOUND))
  ).catch((error: unknown) => error)
  expect(isNotFound(error)).toBe(true)
})

test("preserves other errors, including authorization and infrastructure failures", async () => {
  const error = new Error("Forbidden")
  expect(
    await catalogResource(Promise.reject(error)).catch(
      (failure: unknown) => failure
    )
  ).toBe(error)
})
